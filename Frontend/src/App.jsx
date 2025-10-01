import { useState } from 'react'
import './App.css'

// Custom CSS styles for the app
const styles = {
  container: {
    minHeight: '100vh',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '2rem 0'
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#4338ca',
    marginBottom: '0.5rem'
  },
  subheading: {
    color: '#4b5563',
    marginBottom: '1.5rem'
  },
  main: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    padding: '1.5rem'
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem',
    '@media (min-width: 768px)': {
      gridTemplateColumns: '1fr 1fr'
    }
  },
  uploadSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  dropzone: {
    border: '2px dashed #d1d5db',
    borderRadius: '0.5rem',
    padding: '1rem',
    textAlign: 'center',
    cursor: 'pointer'
  },
  previewContainer: {
    position: 'relative'
  },
  previewImage: {
    margin: '0 auto',
    maxHeight: '18rem',
    objectFit: 'contain',
    borderRadius: '0.25rem'
  },
  previewOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    opacity: 0,
    transition: 'opacity 0.2s',
    borderRadius: '0.25rem',
    ':hover': {
      opacity: 1
    }
  },
  changeImageBtn: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem'
  },
  uploadPlaceholder: {
    padding: '3rem 0'
  },
  placeholderIcon: {
    margin: '0 auto',
    height: '3rem',
    width: '3rem',
    color: '#9ca3af'
  },
  uploadText: {
    marginTop: '0.5rem',
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  uploadSubtext: {
    fontSize: '0.75rem',
    color: '#9ca3af'
  },
  button: {
    width: '100%',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontWeight: '500',
    color: 'white',
    transition: 'background-color 0.2s'
  },
  buttonPrimary: {
    backgroundColor: '#4f46e5',
    ':hover': {
      backgroundColor: '#4338ca'
    }
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed'
  },
  spinnerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinner: {
    animation: 'spin 1s linear infinite',
    marginRight: '0.75rem',
    height: '1.25rem',
    width: '1.25rem'
  },
  resultsSection: {
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    padding: '1.5rem'
  },
  resultsHeading: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1rem'
  },
  errorMessage: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem'
  },
  noResults: {
    textAlign: 'center',
    padding: '2rem 0',
    color: '#6b7280'
  },
  resultCard: {
    padding: '1rem',
    borderRadius: '0.375rem'
  },
  resultCardInfected: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca'
  },
  resultCardHealthy: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0'
  },
  resultHeading: {
    fontWeight: 'bold',
    fontSize: '1.125rem'
  },
  resultHeadingInfected: {
    color: '#b91c1c'
  },
  resultHeadingHealthy: {
    color: '#15803d'
  },
  resultText: {
    fontSize: '0.875rem'
  },
  resultTextInfected: {
    color: '#dc2626'
  },
  resultTextHealthy: {
    color: '#16a34a'
  },
  infoSection: {
    marginTop: '1rem'
  },
  infoHeading: {
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  },
  infoText: {
    fontSize: '0.875rem',
    color: '#4b5563'
  },
  alertBox: {
    backgroundColor: '#fefce8',
    border: '1px solid #fef08a',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    marginTop: '1rem'
  },
  alertHeading: {
    fontWeight: '500',
    color: '#854d0e'
  },
  alertList: {
    listStyleType: 'disc',
    listStylePosition: 'inside',
    fontSize: '0.875rem',
    color: '#a16207',
    marginTop: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  footer: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
    marginTop: '2rem',
    color: '#4b5563',
    fontSize: '0.875rem'
  }
};

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Reset prediction and error states
    setPrediction(null);
    setError(null);
  };

  // Handle prediction submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Create form data
    const formData = new FormData();
    formData.append('image', selectedFile);

    // Backend API URL - make sure the backend is running on this address
    const apiUrl = 'http://localhost:5000/predict';

    try {
      console.log(`Sending request to ${apiUrl}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      }).catch(err => {
        if (err.name === 'AbortError') {
          throw new Error('Request timed out. The server might be down or not responding.');
        }
        if (err.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to the server. Please make sure the backend is running at ' + apiUrl);
        }
        throw err;
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Server responded with error: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const result = await response.json();
      console.log('Prediction result:', result);
      setPrediction(result);
    } catch (err) {
      console.error('Error during prediction:', err);
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Could not connect to the backend server. Please make sure it is running at http://localhost:5000');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.heading}>Cow Lumpy Disease Detection</h1>
        <p style={styles.subheading}>Upload an image to check if a cow has lumpy disease</p>
      </header>

      <main style={styles.main}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
          gap: '2rem'
        }}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div style={{
              border: '2px dashed #d1d5db', 
              borderRadius: '0.5rem', 
              padding: '1rem', 
              textAlign: 'center'
            }}>
              <input 
                type="file" 
                id="image-upload" 
                accept="image/*" 
                onChange={handleFileChange}
                style={{display: 'none'}} 
              />
              <label 
                htmlFor="image-upload" 
                style={{display: 'block', cursor: 'pointer'}}
              >
                {preview ? (
                  <div style={{position: 'relative'}}>
                    <img 
                      src={preview} 
                      alt="Preview" 
                      style={{
                        margin: '0 auto',
                        maxHeight: '18rem',
                        objectFit: 'contain',
                        borderRadius: '0.25rem'
                      }} 
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      opacity: 0,
                      borderRadius: '0.25rem',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '0'}
                    >
                      <span style={{
                        backgroundColor: '#4f46e5',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem'
                      }}>Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div style={{padding: '3rem 0'}}>
                    <svg style={{
                      margin: '0 auto',
                      height: '3rem',
                      width: '3rem',
                      color: '#9ca3af'
                    }} stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path 
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                        strokeWidth={2} 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                    </svg>
                    <p style={{
                      marginTop: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>Click to upload an image</p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#9ca3af'
                    }}>PNG, JPG, JPEG up to 10MB</p>
                  </div>
                )}
              </label>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!selectedFile || isLoading}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: selectedFile && !isLoading ? '#4f46e5' : '#9ca3af',
                cursor: !selectedFile || isLoading ? 'not-allowed' : 'pointer',
                border: 'none',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                if (selectedFile && !isLoading) {
                  e.currentTarget.style.backgroundColor = '#4338ca';
                }
              }}
              onMouseOut={(e) => {
                if (selectedFile && !isLoading) {
                  e.currentTarget.style.backgroundColor = '#4f46e5';
                }
              }}
            >
              {isLoading ? (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg style={{
                    animation: 'spin 1s linear infinite',
                    marginRight: '0.75rem',
                    height: '1.25rem',
                    width: '1.25rem'
                  }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle style={{opacity: 0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{opacity: 0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Analyze Image"}
            </button>
          </div>
          
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>Results</h2>
            
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem'
              }}>
                {error}
              </div>
            )}
            
            {!prediction && !error && (
              <div style={{
                textAlign: 'center',
                padding: '2rem 0',
                color: '#6b7280'
              }}>
                Upload and analyze an image to see results
              </div>
            )}
            
            {prediction && (
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div style={{
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  backgroundColor: prediction.result === 'Infected' ? '#fef2f2' : '#f0fdf4',
                  border: prediction.result === 'Infected' ? '1px solid #fecaca' : '1px solid #bbf7d0'
                }}>
                  <h3 style={{
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    color: prediction.result === 'Infected' ? '#b91c1c' : '#15803d'
                  }}>
                    {prediction.result}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: prediction.result === 'Infected' ? '#dc2626' : '#16a34a'
                  }}>
                    Confidence: {Math.round(prediction.probability * 100)}%
                  </p>
                </div>
                
                <div style={{marginTop: '1rem'}}>
                  <h3 style={{
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>What is Lumpy Disease?</h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#4b5563'
                  }}>
                    Lumpy Skin Disease is a viral disease that affects cattle. It is characterized by fever, 
                    nodules on the skin, and can lead to death in severe cases. Early detection is crucial 
                    for preventing spread and providing proper treatment.
                  </p>
                </div>
                
                {prediction.result === 'Infected' && (
                  <div style={{
                    backgroundColor: '#fefce8',
                    border: '1px solid #fef08a',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    marginTop: '1rem'
                  }}>
                    <h3 style={{
                      fontWeight: '500',
                      color: '#854d0e'
                    }}>Recommended Actions:</h3>
                    <ul style={{
                      listStyleType: 'disc',
                      listStylePosition: 'inside',
                      fontSize: '0.875rem',
                      color: '#a16207',
                      marginTop: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}>
                      <li>Isolate the affected animal</li>
                      <li>Contact a veterinarian immediately</li>
                      <li>Monitor other animals for symptoms</li>
                      <li>Follow biosecurity protocols to prevent spread</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
        marginTop: '2rem',
        color: '#4b5563',
        fontSize: '0.875rem'
      }}>
        <p>© 2025 Cow Lumpy Disease Detection System</p>
      </footer>
      
      <style jsx="true">{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default App
