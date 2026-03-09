# Tom Gunst Videography Portfolio

A minimalist dark-themed videography portfolio website showcasing Tom Gunst's work with clean typography and smooth animations, including admin functionality for content management and video visibility control with progressive streaming capabilities and YouTube video embed support.

## Core Features

### Homepage/Header
- Display "Tom Gunst" prominently at the top in large light text
- Navigation menu with "Work", "ZeroFux", "About", and "Contact" links in smaller font size
- Admin Panel link/button visible in header only for logged-in users with admin privileges
- Dark background (#141414) with minimalist design
- Internet Identity login option hidden from public site and only accessible through direct admin page access or when already authenticated

### Work Page
- Grid layout displaying video project thumbnails in customizable order with 16:9 aspect ratio
- Each thumbnail represents a video project with consistent sizing and no distortion
- Video titles are hidden by default and appear as overlay on hover with smooth fade-in transition
- Title overlay appears over a subtle dark overlay that maintains the minimalist aesthetic
- Clicking a thumbnail opens either a lightbox-style video player for uploaded videos or an embedded YouTube player for YouTube videos
- Video player overlay with play controls and close button for uploaded videos
- Embedded YouTube player overlay with native YouTube controls for YouTube videos
- Progressive video playback that begins as soon as the first segment is loaded for uploaded videos
- Smooth hover animations on thumbnails with title reveal functionality
- Automatically displays only visible video projects in admin-defined order
- Loading state indicator while fetching video projects from backend
- Fallback state when no video projects are available or loading fails
- Admin-only "Edit Order" button that is only visible for logged-in users with admin role, never for regular users or anonymous visitors
- In reorder mode, thumbnails become draggable with visual feedback
- "Save Order" button to persist the new arrangement for all visitors
- YouTube embedded videos maintain the same 16:9 aspect ratio and grid layout consistency
- Video view tracking when videos are opened in lightbox or embedded player

### ZeroFux Page
- Simple dark background with light text matching overall site design
- No page title displayed - content starts directly with descriptive text
- Descriptive text positioned at the top with left-aligned layout matching the content width of other pages
- Descriptive text with the exact content: "What started as a childhood dream to become a YouTuber has grown over the years into multiple YouTube channels. From gaming videos and computer tutorials to my current channel "ZeroFux", where I mainly share travel videos and personal memories, without commercial pressure. It's my place to experiment creatively and fully express myself."
- Text styled with light gray color (text-gray-300), readable font size (text-sm md:text-base), and proper spacing
- Text aligned with the same left margin as the site title and navigation tabs, matching the content width of other pages
- Single centered button labeled "Open on YouTube" positioned below the descriptive text
- Button links directly to https://www.youtube.com/@ZeroFuxBE/videos and opens in a new browser tab
- Button styling consistent with site's minimalist design aesthetic and horizontally centered
- Dark background (#141414) and light text styling consistent with overall site theme
- Clean presentation with consistent spacing and proportional layout matching other pages

### About Page
- Simple dark background with light text matching overall site design
- Display "About" title prominently with same styling as other page titles
- Consistent max-width and alignment matching other pages
- Simple placeholder section for future customization with text or images about Tom Gunst
- Minimalist layout consistent with overall design aesthetic
- Clean presentation with consistent spacing and proportional layout matching other pages
- Content aligned with the same left margin as the site title and navigation tabs

### Contact Page
- Simple dark background with light text
- Display "Contact" title prominently
- Contact information aligned with the same left margin as the site title and navigation tabs
- Contact information font size matches the navigation tabs font size for visual consistency
- Permanently visible contact information below the title:
  - Email: tom.gunst@outlook.com
  - Tel nr: +32485363655
- Social media links (placeholders for various platforms)
- Minimalist layout consistent with overall design
- Clean presentation with consistent alignment and proportional spacing matching the overall site layout
- Contact information is always visible to all visitors

### Admin Interface
- Secure admin login page with authentication accessible only through direct admin page access
- Internet Identity login option only visible on admin page or when already authenticated
- Admin dashboard for managing video projects with Dashboard Overview section
- Dashboard Overview section displaying:
  - Visitor statistics: total visits, unique visitors, and recent activity
  - Video statistics: total views per video with view counts
  - Simple graph or count summary using minimalistic UI with numeric cards or bar chart
  - Statistics displayed in read-only format for admin users only
  - Design consistent with minimalist dark aesthetic and typography
- Video project creation form with two options:
  - Upload video file option with single video file selection and optional thumbnail upload
  - YouTube video option with YouTube URL input field
  - Upload progress indicator for file uploads
  - Automatic project creation for both uploaded videos and YouTube videos
  - Auto-generation of temporary thumbnail from random video frame (approximately middle of video) when no thumbnail is provided for uploaded videos
  - For YouTube videos, thumbnail can be manually uploaded or auto-fetched from YouTube if available
- Individual project management with inline editing for each video project:
  - Project title (editable)
  - Project description (editable)
  - Video type indicator (uploaded file or YouTube)
  - For uploaded videos: thumbnail image upload/replacement, video frame selection tool, video file replacement
  - For YouTube videos: YouTube URL editing, thumbnail upload/replacement
  - Visibility toggle (show/hide)
- Video frame thumbnail generator (for uploaded videos only):
  - Play video in admin interface to preview frames with progressive streaming
  - Click or select specific frame to capture as thumbnail
  - "Grab this frame" button is enabled whenever video is loaded and playback has started
  - Button remains enabled during video playback and when video is paused
  - Button is only disabled when no video is loaded or before initial playback
  - Clicking "Grab this frame" captures the current video frame to canvas
  - Generate 16:9 aspect ratio thumbnail from captured frame
  - Update preview image immediately after frame capture
  - Save captured thumbnail as project's thumbnail through backend endpoint
  - Cross-browser compatibility for frame capture functionality
  - Generate 16:9 aspect ratio thumbnail from selected frame
  - Replace existing thumbnail with newly captured frame
- Edit existing video projects (modify title, description, replace files/URLs, update thumbnails)
- Delete video projects with confirmation
- Reorder video projects using drag-and-drop interface
- List view of all existing projects for management with visibility controls
- Show/Hide toggle for each video project (eye icon or toggle switch)
- Toggle controls allow admins to set video visibility on the public portfolio
- Real-time updates without page refresh after uploads
- All admin pages maintain the dark background (#141414) theme
- All admin functionalities accessible only when logged in as admin
- Full backward compatibility with existing uploaded video projects

## Design Requirements
- Dark background theme throughout (#141414 - RGB 20,20,20)
- Light text for high contrast and readability on dark background
- Clean, modern typography
- Navigation links with reduced font size (approximately 33% smaller)
- Admin Panel link visible in header only for authenticated admin users
- Contact information font size matches navigation tabs font size
- ZeroFux page descriptive text styled with light gray color (text-gray-300) and readable font size (text-sm md:text-base)
- ZeroFux page descriptive text left-aligned with same content width as other pages
- ZeroFux page button styling consistent with site's minimalist design and horizontally centered
- ZeroFux page has no title header - content starts directly with descriptive text
- About page title and content alignment matches other page layouts
- Contact page text alignment matches the left margin of site title and navigation tabs
- Video thumbnails maintain 16:9 aspect ratio with consistent sizing and no distortion
- Auto-generated thumbnails from video frames maintain 16:9 aspect ratio
- YouTube embedded players maintain 16:9 aspect ratio and consistent grid layout
- Video titles hidden by default, appearing as overlay on hover with smooth fade-in transition
- Title overlay with subtle dark background for readability while maintaining minimalist style
- Smooth hover animations and transitions throughout
- Loading indicators for content fetching
- Responsive design for desktop, tablet, and mobile devices
- Grid-based layouts that adapt to different screen sizes
- Admin interface follows the same design consistency
- Dashboard Overview statistics displayed with minimalistic UI using numeric cards or simple bar charts
- Statistics section maintains dark background theme and consistent typography
- Drag-and-drop visual feedback during reordering
- Contact page maintains consistent alignment and proportional spacing with overall site layout
- About page maintains consistent alignment and proportional spacing with overall site layout
- Upload progress indicators and real-time feedback
- Inline editing interface for video project details
- Video frame selection interface with playback controls for thumbnail generation (uploaded videos only)
- Proper button state management for thumbnail capture functionality
- Internet Identity login hidden from public site interface
- Admin-only UI elements visible only to authenticated admin users
- Progressive video loading indicators and smooth playback start
- YouTube embed integration with consistent styling
- Application content in English language

## Backend Data
The backend stores:
- Video project information (title, description, video type, video file references or YouTube URL, thumbnail references, visibility status)
- Video project ordering sequence (ordered list of video IDs)
- Contact information and social media links
- About page content and metadata
- Portfolio metadata
- Admin authentication credentials and user roles
- Uploaded video files and thumbnail images via blob storage with progressive streaming support (for uploaded videos)
- YouTube video URLs and metadata (for YouTube videos)
- Auto-generated thumbnails from video frames
- Thumbnail metadata (whether auto-generated, manually uploaded, or fetched from YouTube)
- Analytics data including:
  - Video view counts per video project (videoViews: Map<Text, Nat>)
  - Total page visits counter (totalVisits)
  - Visitor statistics and activity tracking data

## Backend Operations
- Retrieve only visible video projects for the work page in specified order
- Retrieve all video projects (visible and hidden) for admin management
- Get contact information for the contact page
- Get about page content and metadata
- Serve video thumbnails and metadata
- Serve video files with progressive streaming support using HTTP range requests (for uploaded videos)
- Handle partial content requests (HTTP 206) for chunked video delivery
- Support byte-range requests for efficient video streaming
- Provide fallback for browsers that don't support partial content requests
- Admin authentication and session management with role verification
- Verify admin role for protected operations and UI element visibility
- Create video projects from either uploaded files or YouTube URLs
- Upload single video file with optional thumbnail (for uploaded videos)
- Store YouTube URL and metadata (for YouTube videos)
- Auto-generate thumbnail from video frame when no thumbnail is provided during upload
- Create new video project from single upload or YouTube URL (default visible = true)
- Update existing video project information, files, or URLs
- Update thumbnails independently from video files or URLs
- Generate thumbnails from specific video frames selected by admin (uploaded videos only)
- Extract and process video frames for thumbnail creation with 16:9 aspect ratio
- Toggle video project visibility status (admin only)
- Delete video projects and associated files
- Update video project ordering via admin-only endpoint
- Store and retrieve video files and thumbnails using blob storage with streaming capabilities
- Manage file uploads for videos and thumbnails separately
- Support real-time project list updates after operations
- Process video frame extraction and thumbnail generation from video content (uploaded videos only)
- Provide authentication status and role information to frontend for UI control
- Optimize video delivery through progressive streaming and chunked transfer
- Maintain backward compatibility with existing uploaded video projects
- Analytics operations:
  - Track and increment video view counts when videos are opened in lightbox or embedded player
  - Track and increment total page visits
  - Provide getStats() query function returning visitor statistics and video view counts
  - Store and retrieve analytics data for admin dashboard overview
  - Ensure analytics data is only accessible to authenticated admin users
