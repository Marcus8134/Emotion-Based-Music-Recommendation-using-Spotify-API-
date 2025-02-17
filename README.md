# Emotion-Based-Music-Recommendation-using-Spotify-API
📌 Overview
The Emotion-Based Music Recommendation System is an AI-powered project that detects a user's facial emotions in real time and suggests music playlists accordingly. Using DeepFace for emotion detection and   Spotify API for song recommendations, this system enhances user experience by providing personalized music based on mood.

🚀 Features:
    🎭 Real-Time Emotion Detection: Captures facial expressions using a webcam and classifies emotions.
    🎵 Dynamic Playlist Generation: Fetches song recommendations from Spotify based on detected emotions.
    🎨 Interactive UI: Displays detected emotions and recommended songs in a user-friendly interface.
    🔗 FastAPI Backend: Efficient API for handling requests and processing song data.
    📷 OpenCV Integration: Real-time video processing for accurate facial emotion analysis.

🛠️ Tech Stack
    Frontend: HTML, CSS, JavaScript
    Backend: FastAPI (Python)
    AI Model: DeepFace for emotion recognition
    Video Processing: OpenCV
    Music API: Spotify API for fetching playlists

🎯 How It Works
    1.The camera captures the user's face in real time.
    2.The DeepFace model detects emotions (happy, sad, neutral, angry, etc.).
    3.The backend sends the detected emotion to the Spotify API.
    4.A personalized playlist is generated based on the mood.
    5.The user can play music directly from the UI.
