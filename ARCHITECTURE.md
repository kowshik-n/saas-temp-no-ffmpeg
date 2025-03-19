# Subtitle Editor Application Architecture

## Overview

This application is a browser-based subtitle editor that allows users to upload videos, create and edit subtitles, and export them in SRT format. The application has both free and premium (Pro) tiers with feature restrictions.

## Feature-Based Architecture

The codebase is organized into feature modules:

- **Landing**: Initial user experience and application header
- **Subtitles**: Core subtitle editing functionality

## Key Components

### Home Page

The main application container that orchestrates the overall flow:

- Manages video upload state
- Conditionally renders WelcomeScreen or EditorWorkspace
- Passes down Pro status to child components

### Pro Context

Manages premium feature access:

- Tracks Pro status
- Provides feature checking functionality
- Defines feature limits and upgrade messages

### Subtitle Editing Flow

1. User uploads a video file
2. Video is processed and displayed in the player
3. User can import existing SRT files or create subtitles manually
4. Subtitles are synchronized with video playback
5. User can edit subtitle text, timing, and styling
6. Final subtitles can be exported as SRT files

## Data Flow

1. Video upload state is managed by useVideoUpload hook
2. Subtitle data is managed by useSubtitles hook
3. Subtitle styling is managed by useSubtitleStyles hook
4. Pro feature access is controlled by ProContext

## Technical Stack

- React + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- ShadCN UI components
- React Router for navigation

## Future Improvements

- Add user authentication
- Implement cloud storage for projects
- Add more export formats (VTT, ASS, etc.)
- Implement automatic subtitle generation
- Add collaborative editing features
