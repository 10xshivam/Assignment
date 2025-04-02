import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaEllipsisH, FaSearch, FaHeart, FaRegHeart, FaVolumeUp, FaVolumeMute, FaList, FaTimes } from 'react-icons/fa';
import './App.scss';
import musicData from './data/musicData';

// Define types for songs and player
interface Song {
  id: number;
  title: string;
  artistName: string;
  thumbnail: string;
  musicUrl: string;
  duration: string;
  plays: number;
}

function App() {
  // States
  const [songs, setSongs] = useState<Song[]>(musicData);
  const [allSongs, _setAllSongs] = useState<Song[]>(musicData);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [currentSongId, setCurrentSongId] = useState<number>(musicData[0].id);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [activeTab, setActiveTab] = useState<string>('forYou');
  const [showMenu, setShowMenu] = useState<boolean>(true);
  const [showSongList, setShowSongList] = useState<boolean>(false); // For mobile view
  const [gradientColor, setGradientColor] = useState<string>('rgba(25, 25, 40, 0.8)');
  const [volume, _setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  // const volumeBarRef = useRef<HTMLDivElement>(null);

  // Get the current song
  const currentSong = allSongs.find(song => song.id === currentSongId) || allSongs[0];

  // Load favorites from local storage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
    
    const storedRecentlyPlayed = sessionStorage.getItem('recentlyPlayed');
    if (storedRecentlyPlayed) {
      setRecentlyPlayed(JSON.parse(storedRecentlyPlayed));
    }
    
    // Set loading to false after a short delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Update progress bar as audio plays
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, [currentSongIndex]);

  // Update recently played when song changes
  useEffect(() => {
    if (currentSong) {
      // Set gradient color based on song
      const artistGradients: Record<string, string> = {
        "The Weeknd": "rgba(180, 20, 80, 0.8)",
        "Imagine Dragons": "rgba(30, 100, 180, 0.8)",
        "Coldplay": "rgba(10, 80, 160, 0.8)",
        "Ryan Jones": "rgba(80, 20, 120, 0.8)"
      };
      
      // Apply artist-specific gradient or default
      setGradientColor(artistGradients[currentSong.artistName] || "rgba(25, 25, 40, 0.8)");
      
      const isAlreadyInList = recentlyPlayed.some(song => song.id === currentSong.id);
      if (!isAlreadyInList) {
        const newRecentlyPlayed = [currentSong, ...recentlyPlayed].slice(0, 10);
        setRecentlyPlayed(newRecentlyPlayed);
        sessionStorage.setItem('recentlyPlayed', JSON.stringify(newRecentlyPlayed));
      }
    }
  }, [currentSongId]);
  
  // Update document title
  useEffect(() => {
    if (currentSong) {
      document.title = `${currentSong.title} - ${currentSong.artistName}`;
    }
  }, [currentSong]);
  
  // Update audio src when song changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSongId]);
  
  // Handle play state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Handle mute/unmute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted) {
        audioRef.current.volume = volume;
      }
    }
  }, [isMuted, volume]);
  
  // Format time in MM:SS
  const formatTime = (time: number) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    return '0:00';
  };
  
  // Progress bar click handler
  const handleProgressBarClick = (e: React.MouseEvent) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * duration;
      setCurrentTime(pos * duration);
    }
  };
  
  // Volume bar click handler
  // const handleVolumeBarClick = (e: React.MouseEvent) => {
  //   if (volumeBarRef.current && audioRef.current) {
  //     const rect = volumeBarRef.current.getBoundingClientRect();
  //     const newVolume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  //     setVolume(newVolume);
  //     audioRef.current.volume = newVolume;
  //     if (isMuted && newVolume > 0) {
  //       setIsMuted(false);
  //     }
  //   }
  // };
  
  // Toggle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Check if a song is a favorite
  const isFavorite = (song: Song) => {
    return favorites.some(f => f.id === song.id);
  };
  
  // Toggle favorite status
  const toggleFavorite = (song: Song) => {
    if (isFavorite(song)) {
      const newFavorites = favorites.filter(f => f.id !== song.id);
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      const newFavorites = [...favorites, song];
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  };
  
  // Handle play/pause
  const handlePlayPause = () => {
    if (audioRef.current) {
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle next song
  const handleNext = () => {
    const nextIndex = (currentSongIndex + 1) % allSongs.length;
    setCurrentSongIndex(nextIndex);
    setCurrentSongId(allSongs[nextIndex].id);
    setIsPlaying(true);
  };
  
  // Handle previous song
  const handlePrevious = () => {
    const prevIndex = (currentSongIndex - 1 + allSongs.length) % allSongs.length;
    setCurrentSongIndex(prevIndex);
    setCurrentSongId(allSongs[prevIndex].id);
    setIsPlaying(true);
  };
  
  // Handle song selection
  const handleSelectSong = (song: Song) => {
    const newIndex = allSongs.findIndex(s => s.id === song.id);
    setCurrentSongIndex(newIndex);
    setCurrentSongId(song.id);
    setIsPlaying(true);
    setShowSongList(false); // Hide song list on mobile after selection
  };
  
  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSongs(allSongs);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = allSongs.filter(song => 
      song.title.toLowerCase().includes(query) || 
      song.artistName.toLowerCase().includes(query)
    );
    
    setSongs(filtered);
  }, [searchQuery, allSongs]);
  
  // Get filtered songs based on active tab
  const getDisplaySongs = () => {
    switch (activeTab) {
      case 'topTracks':
        return songs.sort((a, b) => b.plays - a.plays).slice(0, 10);
      case 'favorites':
        return favorites;
      case 'recentlyPlayed':
        return recentlyPlayed;
      default:
        return songs;
    }
  };

  // Toggle dropdown menu
  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showDropdown) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  // Audio error handling
  useEffect(() => {
    const handleAudioError = (e: Event) => {
      console.error("Audio error:", e);
      // Optionally try to restart playback or move to next song
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('error', handleAudioError);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('error', handleAudioError);
      }
    };
  }, []);

  return (
    <div className="app-container" style={{
      background: gradientColor,
      transition: 'background 0.8s ease'
    }}>
      {isLoading && (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading your music...</div>
        </div>
      )}
      
      {/* DESKTOP VIEW */}
      <Container fluid className={`desktop-view d-none d-lg-block ${isLoading ? 'content-hidden' : ''}`}>
        <Row className="flex-nowrap">
          {/* Left sidebar - Only shown if menu is visible */}
          {showMenu && (
            <Col md={3} lg={2} className="sidebar p-4">
              <div className="logo mb-4">
                <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" alt="Spotify" />
              </div>
              
              <div className="sidebar-menu">
                <div 
                  className={`menu-item ${activeTab === 'forYou' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveTab('forYou');
                    if (isPlaying) {
                      handlePlayPause();
                    }
                  }}
                >
                  <i className="menu-icon for-you-icon"></i>
                  For You
                </div>
                <div 
                  className={`menu-item ${activeTab === 'topTracks' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveTab('topTracks');
                    if (isPlaying) {
                      handlePlayPause();
                    }
                  }}
                >
                  <i className="menu-icon top-tracks-icon"></i>
                  Top Tracks
                </div>
                <div 
                  className={`menu-item ${activeTab === 'favorites' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveTab('favorites');
                    if (isPlaying) {
                      handlePlayPause();
                    }
                  }}
                >
                  <i className="menu-icon favorites-icon"></i>
                  Favourites
                </div>
                <div 
                  className={`menu-item ${activeTab === 'recentlyPlayed' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveTab('recentlyPlayed');
                    if (isPlaying) {
                      handlePlayPause();
                    }
                  }}
                >
                  <i className="menu-icon recent-icon"></i>
                  Recently Played
                </div>
              </div>
            </Col>
          )}
          
          {/* Main content */}
          <Col md={showMenu ? 9 : 12} lg={showMenu ? 5 : 9} className="main-content p-4">
            <div className="d-md-none mb-3">
              <Button 
                variant="outline-light" 
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
              >
                {showMenu ? 'Hide Menu' : 'Show Menu'}
              </Button>
            </div>
            
            <h2 className="section-title">{activeTab === 'forYou' ? 'For You' : 
              activeTab === 'topTracks' ? 'Top Tracks' : 
              activeTab === 'favorites' ? 'Favourites' : 'Recently Played'}</h2>
            
            <div className="search-bar mb-4">
              <Form.Control
                type="text"
                placeholder="Search Song, Artist"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <FaSearch className="search-icon" />
            </div>
            
            <div className="song-list">
              {getDisplaySongs().length === 0 ? (
                <div className="no-songs-message">
                  {activeTab === 'favorites' ? 
                    "You haven't added any favorites yet" : 
                    activeTab === 'recentlyPlayed' ? 
                    "You haven't played any songs yet" : 
                    "No songs found matching your search"}
                </div>
              ) : (
                getDisplaySongs().map((song, index) => (
                  <div 
                    key={song.id}
                    className={`song-item ${song.id === currentSongId ? 'active' : ''}`}
                    onClick={() => handleSelectSong(song)}
                  >
                    <div className="song-number">{index + 1}</div>
                    <div className="song-thumbnail">
                      <img src={song.thumbnail} alt={song.title} />
                      {song.id === currentSongId && isPlaying && (
                        <div className="song-playing-overlay">
                          <div className="playing-animation">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      )}
                      {song.id === currentSongId && !isPlaying && (
                        <div className="song-paused-overlay">
                          <FaPlay />
                        </div>
                      )}
                    </div>
                    <div className="song-info">
                      <div className="song-title">{song.title}</div>
                      <div className="song-artist">{song.artistName}</div>
                    </div>
                    <div className="song-duration">{song.duration}</div>
                    <div className="song-actions" onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(song);
                    }}>
                      {isFavorite(song) ? 
                        <FaHeart className="favorite-icon active" /> : 
                        <FaRegHeart className="favorite-icon" />
                      }
                    </div>
                  </div>
                ))
              )}
            </div>
          </Col>
          
          {/* Right panel wrapper - for centering the now playing */}
          <Col lg={5} className="d-flex justify-content-center align-items-center p-0">
            {/* Now playing section */}
            <div className="now-playing p-4">
              {currentSong && (
                <>
                  <div className="now-playing-header">
                    <h2 className="now-playing-title">{currentSong.title}</h2>
                    <h3 className="now-playing-artist">{currentSong.artistName}</h3>
                  </div>

                  <div className="now-playing-cover mt-4 mb-4">
                    <img src={currentSong.thumbnail} alt={currentSong.title} />
                    {isPlaying && (
                      <div className="playing-indicator">
                        <div className="playing-disc"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="progress-container" onClick={handleProgressBarClick} ref={progressBarRef}>
                    <div 
                      className="progress-bar" 
                      style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="player-controls mt-4">
                    <div className="position-relative">
                      <Button 
                        variant="link" 
                        className="control-btn" 
                        onClick={handleDropdownToggle}
                      >
                        <FaEllipsisH />
                      </Button>
                      {showDropdown && (
                        <div className="context-menu">
                          <div 
                            className="menu-item" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(currentSong);
                              setShowDropdown(false);
                            }}
                          >
                            {isFavorite(currentSong) ? 
                              <><FaHeart style={{color: '#e91429', marginRight: '10px'}} /> Remove from Favorites</> : 
                              <><FaRegHeart style={{marginRight: '10px'}} /> Add to Favorites</>
                            }
                          </div>
                        </div>
                      )}
                    </div>
                    <Button variant="link" className="control-btn" onClick={handlePrevious}>
                      <FaStepBackward />
                    </Button>
                    <Button variant="link" className="control-btn play-btn" onClick={handlePlayPause}>
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </Button>
                    <Button variant="link" className="control-btn" onClick={handleNext}>
                      <FaStepForward />
                    </Button>
                    <Button variant="link" className="control-btn" onClick={toggleMute}>
                      {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
      
      {/* MOBILE VIEW */}
      <div className="mobile-view d-lg-none">
        {/* Player component as main interface */}
        {!showSongList && currentSong && (
          <div className="mobile-player-view">
            <Button 
              className="mobile-menu-toggle" 
              variant="outline-light"
              onClick={() => setShowSongList(true)}
            >
              <FaList />
            </Button>
            
            <div className="mobile-player-content">
              <div className="mobile-now-playing-cover">
                <img src={currentSong.thumbnail} alt={currentSong.title} />
                {isPlaying && (
                  <div className="playing-indicator">
                    <div className="playing-disc"></div>
                  </div>
                )}
              </div>
              
              <h2 className="mobile-now-playing-title">{currentSong.title}</h2>
              <h3 className="mobile-now-playing-artist">{currentSong.artistName}</h3>
              
              <div className="mobile-progress-container" onClick={handleProgressBarClick} ref={progressBarRef}>
                <div 
                  className="mobile-progress-bar" 
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                ></div>
              </div>
              
              <div className="mobile-time-info">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              
              <div className="mobile-player-controls">
                <Button variant="link" className="control-btn" onClick={handlePrevious}>
                  <FaStepBackward />
                </Button>
                <Button variant="link" className="control-btn play-btn" onClick={handlePlayPause}>
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </Button>
                <Button variant="link" className="control-btn" onClick={handleNext}>
                  <FaStepForward />
                </Button>
                <Button variant="link" className="control-btn" onClick={toggleMute}>
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Song list when toggled */}
        {showSongList && (
          <div className="mobile-song-list-view">
            <div className="mobile-song-list-header">
              <h2>{activeTab === 'forYou' ? 'For You' : 
                activeTab === 'topTracks' ? 'Top Tracks' : 
                activeTab === 'favorites' ? 'Favourites' : 'Recently Played'}
              </h2>
              <Button 
                className="mobile-close-button" 
                variant="outline-light"
                onClick={() => setShowSongList(false)}
              >
                <FaTimes />
              </Button>
            </div>
            
            <div className="search-bar mb-4">
              <Form.Control
                type="text"
                placeholder="Search Song, Artist"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="song-list">
              {getDisplaySongs().length === 0 ? (
                <div className="no-songs-message">No songs found</div>
              ) : (
                getDisplaySongs().map((song, index) => (
                  <div 
                    key={song.id}
                    className={`song-item ${song.id === currentSongId ? 'active' : ''}`}
                    onClick={() => handleSelectSong(song)}
                  >
                    <div className="song-number">{index + 1}</div>
                    <div className="song-thumbnail">
                      <img src={song.thumbnail} alt={song.title} />
                      {song.id === currentSongId && isPlaying && (
                        <div className="song-playing-overlay">
                          <div className="playing-animation">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="song-info">
                      <div className="song-title">{song.title}</div>
                      <div className="song-artist">{song.artistName}</div>
                    </div>
                    <div className="song-duration">{song.duration}</div>
                    <div className="song-actions" onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(song);
                    }}>
                      {isFavorite(song) ? 
                        <FaHeart className="favorite-icon active" /> : 
                        <FaRegHeart className="favorite-icon" />
                      }
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Audio element */}
      <audio 
        ref={audioRef}
        src={currentSong?.musicUrl}
        onEnded={handleNext}
        preload="auto"
        crossOrigin="anonymous"
        onError={(e) => {
          console.error("Audio element error:", e);
          // Try to reload or move to next song on error
          setTimeout(() => {
            if (isPlaying) handleNext();
          }, 3000);
        }}
      />
    </div>
  );
}

export default App;