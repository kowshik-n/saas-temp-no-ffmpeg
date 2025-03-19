# Subtitles Feature

This module handles all subtitle-related functionality in the application.

## Components

- **SubtitleEditor**: Main editor interface for creating and editing subtitles
- **VideoPlayer**: Video playback with subtitle display
- **EditorWorkspace**: Container component that combines video player and subtitle editor

## Hooks

- **useSubtitles**: Core hook for subtitle management (create, edit, delete, import/export)
- **useVideoUpload**: Handles video file upload and metadata extraction
- **useSubtitleStyles**: Manages subtitle styling options (font, color, position)

## Utils

- **srtParser**: Functions for parsing and formatting SRT files
- **timeUtils**: Time conversion and calculation utilities

## Types

- **Subtitle**: Core subtitle data structure
- **VideoState**: Video player state
- **AspectRatio**: Video aspect ratio options

## Feature Flags

The following features are restricted to Pro users:

- Adding more than 10 subtitles ("unlimited-subtitles")
- Splitting subtitles ("split-subtitle")
- Merging subtitles ("merge-subtitle")
- Splitting all subtitles ("split-all")
- Custom subtitle styles ("custom-styles")
