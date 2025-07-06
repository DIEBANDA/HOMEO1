class ProgressiveVideoLoader {
    constructor() {
        this.videos = [];
        this.currentVideoIndex = 0;
        this.chunkSize = 1024 * 1024; // 1MB chunks
        this.bufferThreshold = 0.1; // Start with 10% buffer threshold
        this.isLoading = false;
        this.connectionSpeed = 'unknown'; // 'fast', 'medium', 'slow'
        this.loadingStartTime = 0;
        this.loadedBytes = 0;
        this.init();
    }

    init() {
        // Get all video elements
        this.videos = document.querySelectorAll('video');
        
        if (this.videos.length === 0) {
            return;
        }

        // Detect connection speed first
        this.detectConnectionSpeed().then(() => {
            // Initialize first video after speed detection
            this.setupVideo(this.videos[0]);
            this.startVideoRotation();
        });
    }

    async detectConnectionSpeed() {
        // Try to use Network Information API if available
        if ('connection' in navigator && navigator.connection.effectiveType) {
            const effectiveType = navigator.connection.effectiveType;
            if (effectiveType === '4g') {
                this.connectionSpeed = 'fast';
                this.bufferThreshold = 0.05; // 5% for fast connections
            } else if (effectiveType === '3g') {
                this.connectionSpeed = 'medium';
                this.bufferThreshold = 0.15; // 15% for medium connections
            } else {
                this.connectionSpeed = 'slow';
                this.bufferThreshold = 0.3; // 30% for slow connections
            }
            return;
        }

        // Fallback: Test download speed with a small image
        try {
            const testStart = performance.now();
            const response = await fetch('/static/images/placeholder.jpg', { 
                method: 'HEAD',
                cache: 'no-cache'
            });
            const testEnd = performance.now();
            
            if (response.ok) {
                const duration = testEnd - testStart;
                if (duration < 100) {
                    this.connectionSpeed = 'fast';
                    this.bufferThreshold = 0.05;
                } else if (duration < 500) {
                    this.connectionSpeed = 'medium';
                    this.bufferThreshold = 0.15;
                } else {
                    this.connectionSpeed = 'slow';
                    this.bufferThreshold = 0.3;
                }
            } else {
                // Default to medium if test fails
                this.connectionSpeed = 'medium';
                this.bufferThreshold = 0.15;
            }
        } catch (error) {
            // Default to medium if test fails
            this.connectionSpeed = 'medium';
            this.bufferThreshold = 0.15;
        }
    }

    setupVideo(video) {
        // Set video properties
        video.muted = true;
        video.playsInline = true;
        video.loop = true;
        
        // Add event listeners
        video.addEventListener('loadedmetadata', () => {
            // Video metadata loaded
        });

        video.addEventListener('canplay', () => {
            this.startProgressiveLoading(video);
        });

        video.addEventListener('progress', () => {
            this.handleProgress(video);
        });

        video.addEventListener('loadstart', () => {
            this.loadingStartTime = performance.now();
            this.loadedBytes = 0;
        });

        video.addEventListener('progress', (e) => {
            // Calculate loading speed
            if (this.loadingStartTime > 0) {
                const currentTime = performance.now();
                const duration = (currentTime - this.loadingStartTime) / 1000; // seconds
                
                // Estimate loaded bytes (rough calculation)
                if (video.buffered.length > 0) {
                    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                    const estimatedBytes = (bufferedEnd / video.duration) * (video.videoWidth * video.videoHeight * 3); // rough estimate
                    
                    if (duration > 0) {
                        const speedBytesPerSecond = estimatedBytes / duration;
                        this.adjustBufferThreshold(speedBytesPerSecond);
                    }
                }
            }
        });

        video.addEventListener('error', (e) => {
            // Handle video error silently
        });

        // Start loading the video
        video.load();
    }

    adjustBufferThreshold(speedBytesPerSecond) {
        // Adjust buffer threshold based on actual loading speed
        if (speedBytesPerSecond > 500000) { // > 500KB/s
            this.bufferThreshold = Math.max(0.05, this.bufferThreshold - 0.01);
        } else if (speedBytesPerSecond < 100000) { // < 100KB/s
            this.bufferThreshold = Math.min(0.5, this.bufferThreshold + 0.01);
        }
    }

    startProgressiveLoading(video) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        // Start playing immediately if connection is fast
        if (this.connectionSpeed === 'fast' && video.readyState >= 2) {
            video.play().then(() => {
                // Video started playing
            }).catch(e => {
                // Handle play error silently
            });
        }
        
        // Monitor buffer for adaptive loading
        this.monitorBuffer(video);
    }

    monitorBuffer(video) {
        const checkBuffer = () => {
            if (video.readyState >= 2) { // HAVE_CURRENT_DATA
                const buffered = video.buffered;
                if (buffered.length > 0) {
                    const currentTime = video.currentTime;
                    const bufferedEnd = buffered.end(buffered.length - 1);
                    const bufferAhead = bufferedEnd - currentTime;
                    const duration = video.duration;
                    
                    const bufferPercentage = bufferAhead / duration;
                    
                    // Start playing based on buffer threshold
                    if (bufferPercentage >= this.bufferThreshold && video.paused) {
                        video.play().then(() => {
                            // Video started playing
                        }).catch(e => {
                            // Handle play error silently
                        });
                    }
                    
                    // Pause if buffer is too low
                    if (bufferPercentage < (this.bufferThreshold * 0.5) && !video.paused) {
                        video.pause();
                    }
                }
            }
            
            // Continue monitoring
            if (!video.ended) {
                requestAnimationFrame(checkBuffer);
            }
        };
        
        checkBuffer();
    }

    handleProgress(video) {
        const buffered = video.buffered;
        if (buffered.length > 0) {
            const currentTime = video.currentTime;
            const bufferedEnd = buffered.end(buffered.length - 1);
            const bufferAhead = bufferedEnd - currentTime;
            
            // Update buffer indicator if it exists
            this.updateBufferIndicator(video, bufferAhead);
        }
    }

    updateBufferIndicator(video, bufferAhead) {
        const indicator = document.getElementById('buffer-indicator');
        if (indicator) {
            const percentage = Math.min((bufferAhead / 5) * 100, 100); // 5 seconds max
            indicator.style.width = percentage + '%';
            indicator.textContent = `Buffer: ${percentage.toFixed(1)}%`;
        }
    }

    startVideoRotation() {
        setInterval(() => {
            this.rotateVideos();
        }, 10000); // Rotate every 10 seconds
    }

    rotateVideos() {
        // Hide current video
        if (this.videos[this.currentVideoIndex]) {
            this.videos[this.currentVideoIndex].style.display = 'none';
        }
        
        // Move to next video
        this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videos.length;
        
        // Show and setup next video
        if (this.videos[this.currentVideoIndex]) {
            const nextVideo = this.videos[this.currentVideoIndex];
            nextVideo.style.display = 'block';
            
            // If video hasn't been loaded yet, load it
            if (nextVideo.readyState === 0) {
                this.setupVideo(nextVideo);
            } else {
                nextVideo.play().catch(e => {
                    // Handle play error silently
                });
            }
        }
    }

    // Public method to get loading status
    getLoadingStatus() {
        return {
            isLoading: this.isLoading,
            currentVideo: this.currentVideoIndex,
            totalVideos: this.videos.length,
            connectionSpeed: this.connectionSpeed,
            bufferThreshold: this.bufferThreshold
        };
    }

    // Public method to manually rotate videos
    rotateToVideo(index) {
        if (index >= 0 && index < this.videos.length) {
            this.currentVideoIndex = index;
            this.rotateVideos();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.progressiveVideoLoader = new ProgressiveVideoLoader();
});

// Export for global access
window.ProgressiveVideoLoader = ProgressiveVideoLoader; 