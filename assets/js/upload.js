// State management
        let selectedFiles = [];
        let fileId = 0;

        // Theme management
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
        }

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            localStorage.setItem('theme', newTheme);
        });

        // Sidebar toggle
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('toggleBtn');
        
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '☰' : '✕';
        });

     document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    if (href && href.endsWith('.html')) {
      // Optional: visual feedback before navigating
      e.preventDefault();

      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      // Optional: slide-out animation
      document.body.classList.remove('slide-in');
      document.body.classList.add('slide-out');

      setTimeout(() => {
        window.location.href = href;
      }, 400); // Adjust time to match animation
    }
  });
});


        // File handling
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const browseBtn = document.getElementById('browseBtn');
        const fileList = document.getElementById('fileList');
        const uploadAllBtn = document.getElementById('uploadAllBtn');

        // File type icons
        const getFileIcon = (filename) => {
            const ext = filename.split('.').pop().toLowerCase();
            const icons = {
                'jpg': '📷', 'jpeg': '📷', 'png': '📷', 'gif': '📷',
                'pdf': 'PDF',
                'docx': 'DOCX', 'doc': 'DOC',
                'txt': 'TXT',
                'zip': '📦', 'rar': '📦'
            };
            return icons[ext] || '📄';
        };

        // Format file size
        const formatFileSize = (bytes) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };

        // Add file to list
        const addFile = (file) => {
            const id = fileId++;
            const fileObj = {
                id: id,
                file: file,
                name: file.name,
                size: file.size,
                type: file.type,
                status: 'pending',
                progress: 0
            };
            
            selectedFiles.push(fileObj);
            renderFileList();
            updateUploadButton();
        };

        // Remove file from list
        const removeFile = (id) => {
            selectedFiles = selectedFiles.filter(file => file.id !== id);
            renderFileList();
            updateUploadButton();
        };

        // Update upload button visibility
        const updateUploadButton = () => {
            const pendingFiles = selectedFiles.filter(file => file.status === 'pending');
            uploadAllBtn.classList.toggle('show', pendingFiles.length > 0);
        };

        // Render file list
        const renderFileList = () => {
            if (selectedFiles.length === 0) {
                fileList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📁</div>
                        <div>No files selected</div>
                    </div>
                `;
                return;
            }

            fileList.innerHTML = selectedFiles.map(file => {
                const ext = file.name.split('.').pop().toLowerCase();
                const icon = getFileIcon(file.name);
                
                let statusHtml = '';
                let progressHtml = '';
                
                switch (file.status) {
                    case 'pending':
                        statusHtml = '<span class="file-status">Ready to upload</span>';
                        break;
                    case 'uploading':
                        statusHtml = '<span class="file-status uploading">Uploading...</span>';
                        progressHtml = `
                            <div class="progress-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${file.progress}%"></div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'completed':
                        statusHtml = '<span class="file-status completed">✓ Completed</span>';
                        break;
                    case 'error':
                        statusHtml = '<span class="file-status error">❌ Error</span>';
                        break;
                }
                
                return `
                    <div class="file-item">
                        <div class="file-icon ${ext}">
                            ${icon}
                        </div>
                        <div class="file-info">
                            <div class="file-name">${file.name}</div>
                            <div class="file-details">
                                <div class="file-size">${formatFileSize(file.size)}</div>
                                ${statusHtml}
                            </div>
                            ${progressHtml}
                        </div>
                        <div class="file-actions">
                            ${file.status === 'error' ? `<button class="action-btn retry-btn" onclick="retryUpload(${file.id})">🔄</button>` : ''}
                            <button class="action-btn delete-btn" onclick="removeFile(${file.id})">🗑️</button>
                        </div>
                    </div>
                `;
            }).join('');
        };

        // Simulate file upload
        const uploadFile = async (fileObj) => {
            return new Promise((resolve) => {
                fileObj.status = 'uploading';
                fileObj.progress = 0;
                renderFileList();
                
                const interval = setInterval(() => {
                    fileObj.progress += Math.random() * 20;
                    if (fileObj.progress >= 100) {
                        fileObj.progress = 100;
                        fileObj.status = 'completed';
                        clearInterval(interval);
                        renderFileList();
                        updateUploadButton();
                        resolve();
                    } else {
                        renderFileList();
                    }
                }, 200);
            });
        };

        // Retry upload
        const retryUpload = (id) => {
            const file = selectedFiles.find(f => f.id === id);
            if (file) {
                file.status = 'pending';
                file.progress = 0;
                renderFileList();
                updateUploadButton();
            }
        };

        // Upload all files
        const uploadAllFiles = async () => {
            const pendingFiles = selectedFiles.filter(file => file.status === 'pending');
            
            for (const file of pendingFiles) {
                await uploadFile(file);
            }
        };

        // Event listeners
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                // Check file size (50MB limit)
                if (file.size > 50 * 1024 * 1024) {
                    alert(`File ${file.name} is too large. Maximum size is 50MB.`);
                    return;
                }
                
                // Check if file already exists
                const exists = selectedFiles.some(f => f.name === file.name && f.size === file.size);
                if (!exists) {
                    addFile(file);
                }
            });
            
            // Reset file input
            fileInput.value = '';
        });

        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files);
            files.forEach(file => {
                // Check file size (50MB limit)
                if (file.size > 50 * 1024 * 1024) {
                    alert(`File ${file.name} is too large. Maximum size is 50MB.`);
                    return;
                }
                
                // Check if file already exists
                const exists = selectedFiles.some(f => f.name === file.name && f.size === file.size);
                if (!exists) {
                    addFile(file);
                }
            });
        });

        uploadAllBtn.addEventListener('click', uploadAllFiles);

        // Make functions global for onclick handlers
        window.removeFile = removeFile;
        window.retryUpload = retryUpload;

        // Initialize
        renderFileList();
        updateUploadButton();
        