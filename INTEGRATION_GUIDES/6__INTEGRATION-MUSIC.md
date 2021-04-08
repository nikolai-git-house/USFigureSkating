# Music Integration
## Overview
This document aids in the process of integration isolated frontend development assets with a backend environment for the Music component.



## General
### Link Targets Needed
The following links require targets.  The blocks of impacted code are flagged with an "@integration" comment.
* Music Launch Point - "Music Upload - File Conversion" - src/views/pages/partials/music-editor.php:77
* Copyright Editor - Additional Copyright Information - "click here" - src/views/pages/partials/music-editor.php:147


### File Upload Input
The file input used to upload music files does not limit file selection based on file type.  If this sort of limitation is desired, the "accept" attribute of the file input located at src/views/pages/partials/music-editor.php:167 can be implemented with the desired list of MEME types.


### File Upload Validation 
The frontend performs basic validation on files before triggering an upload. It checks to ensure the file is 12mb or lower, and that it is of a proper MEME type.
If specifics of frontend validation need to change, they can be modified in `src/js/helpers/MusicUploadHelpers.ts`
* The upload size limit can be changed in the `max_mb` variable (~:19)
* The valid MEME types can be changed in the `valid_mime_types` variable (~:3)

Any changes within this file will require a frontend build (as outlined in `README.MD`) in order to take effect. 

While the frontend performs rudimentary file validation, the core of uploaded file validation including details related to business rules needs to happen on the server side of the "Upload File" API endpoint.


### API Changes
The "Get User Info" API endpoint has been extended to include information about the current user's ability to upload files given the device they are using.
This information determines whether the user can use the upload file input on the music page or whether they see a notice instead.
  


## API Objects
This section outlines the objects used in relation to the API for the Music component. 


### User Information
Represents general information about the currently logged in user.  This object has been extended in this release to include additional information
 
 ```  
user_type: string            - The type of the active user.  Either "skater" or "coach"
upload_file_capability: {    - Information about whether the user can upload files on their current device
     can_upload: boolean,    - Whether the user can upload files on their current device
     error_message: string   - Notice to display in place of upload inputs.  Empty string when can_upload is true. 
}
 ```


### Music File
This object represents an audio file for a `MusicItem`

```  
id: number;            - Unique identifer for the file
url: string;           - Public URL to the audio file
```


### Music Copyright
This object represents a copyright for a `MusicItem`.  All fields are nullable.

```  
title: string | null;                  - The copyright title
artist: string | null;                 - The copyright artist
arrangement: string | null;            - The copyright arrangement 
record_label: string | null;           - The copyright record label
duration_minutes: number | null;       - The copyright duration minutes
duration_seconds: number | null;       - The copyright duration seconds
```


### Music Item
This object represents a complete item of music.

```  
id: number;                                 - Unique identifier for the music item
name: string;                               - Name of the music item
has_been_played: boolean;                   - Whether the user has played the track.  When loading saved music, this should nearly always be true
is_assigned_to_program: boolean             - Whether the music item is assigned to an active program.  Used to determine whether the item can be deleted by the user 
copyrights: MusicCopyright[];               - Array of MusicCopyright objects for the music item 
file: MusicFile;                            - Data about the audio file associated with the music item. When loading saved
```


### Event Segment Music
This object represents a `MusicItem` as associated with an event segment.

```  
competition_id: number;                  - The ID of the competition associated with the event segment
event_id: number;                        - The ID of the event associated with the event segment
event_segment_id: number;                - The ID of the event segment associated with the event segment
competition_skated_event_id: number;     - The ID of the competition skated event associated with the event segment
music: MusicItem | null;            - The MusicItem associated with the event segment.  Null if no music has been associated yet. 
```



## API Endpoints
Even when data is not present, endpoints should return empty representations of their top level properties.


### Fetch Music Library
__Purpose:__ Fetch all the music for the active user's music library

__Request Payload:__ None

__Response:__ An array of `MusicItem` objects within a `library` key

```  
{
  "library": [
    {
      "id": 1,
      "name": "Maid with the Flaxen Hair",
      "has_been_played": true,
      "is_assigned_to_program": true,
      "file": {
        "id": 1,
        "url": "/example-music/MaidWithTheFlaxenHair.mp3"
      },
      "copyrights": [
        {
          "title": "Copyright Title",
          "artist": null,
          "arrangement": null,
          "record_label": null,
          "duration_minutes": 2,
          "duration_seconds": 50
        },
        [...]
      ]
    },
   [...]
  ]
}
```


### Remove Library Song
__Purpose:__ Remove a music item from the user's library

__Request Payload:__ Object containing the ID of the music item to delete

```  
{
  "music_item_id": 4
}
```

__Response:__ Object containing key indicating the removal was successful:
                            
```  
{
"success": true
}
```


### Fetch Event Segment Music
__Purpose:__ Fetch the `MusicItem` associated with a particular event segment 

__Request Payload:__  GET parameters are provided with identifiers related to the event segment:

```  
{
  "competition_id": 1,
  "event_id": 1,
  "event_segment_id": 1,
  "competition_skated_event_id": 4
}
```
 
__Response:__ The `EventSegmentMusic` object associated with the event segment.  If no music has been associated with the event segment yet, the `music` key should contain a null value.

Example 1: No Music Associated
```  
{
  "competition_skated_event_id": 4,
  "competition_id": 1,
  "event_id": 1,
  "event_segment_id": 1,
  "music": null
}
```

Example 2: Music Associated

```  
{
  "competition_skated_event_id": 4,
  "competition_id": 1,
  "event_id": 2,
  "event_segment_id": 1,
  "music": {
    "id": 1,
    "name": "Maid with the Flaxen Hair",
    "has_been_played": true,
    "is_assigned_to_program": true,
    "file": {
      "url": "/example-music/MaidWithTheFlaxenHair.mp3",
      "id": 1
    },
    "copyrights": [
      {
        "title": "Copyright Title",
        "artist": null,
        "arrangement": null,
        "record_label": null,
        "duration_minutes": 2,
        "duration_seconds": 50
      },
      [...]
    ]
  }
}
```


### Save Event Segment Music
__Purpose:__ Save a MusicItem and associate it with an event segment.  
Note: The supplied `MusicItem` data may contain modifications to existing `MusicItem` objects which will need to be saved.

__Request Payload:__ The `EventSegmentMusic` object to save.   
Note: The `is_assigned_to_program` key is not included with the provided `MusicItem`data.

```  
{
  "competition_id": 1,
  "event_id": 2,
  "event_segment_id": 1,
  "competition_skated_event_id": 4,
  "music": {
    "id": 1,
    "name": "Maid with the Flaxen Hair",
    "has_been_played": true,
    "copyrights": [
      {
        "title": "Copyright Title",
        "artist": null,
        "arrangement": null,
        "record_label": null,
        "duration_minutes": 2,
        "duration_seconds": 50
      },
      [...]
    ],
    "file": {
      "url": "/example-music/MaidWithTheFlaxenHair.mp3",
      "id": 1
    }
  }
}
```


__Response:__ Data related to whether the music was saved successfully, whether music is now complete for the event segment, the saved unix timestamp for the last modified date and the saved identifier for the music item:

```  
{
  "success": true,
  "is_complete": true,
  "last_modified": 1534176392,
  "music_item_id": 1
}
```


### Upload Music
__Purpose:__ Upload a file for a music song. 
Note: Backend validation and metadata processing of the file should happen at this point. The front end does basic file size and MEME type validation prior to triggering the upload, but
comprehensive validation related to business rules happens on the server for this endpoint.   

__Request Payload:__ `multipart/form-data` containing the file for upload in a `file` key.

__Response:__ Data related to the success/failure of the upload, uploaded song metadata (only title is used), and the resulting `MusicFile`

Example 1: Success

```  
{
  "success": true,
  "error": false,
  "metadata": {
    "name": "Multi-tiered non-volatile firmware"
  },
  "file": {
    "id": 669,
    "url": "/example-music/MaidWithTheFlaxenHair.mp3"
  }
}
```

Example 2: Error

```  
{
  "success": false,
  "error": true,
  "error_message": "Customizable backend file error message."
}
```


### Delete Uploaded File
__Purpose:__ Delete a file a user has uploaded.  This endpoint is contacted when a user has uploaded a file, but abandons the music editor prior to saving the `MusicItem` for the first time.

__Request Payload:__ The ID of the file to delete.
 
 ```  
 {
 "music_file_id": 669
 }
 ```
 
__Response:__ Object containing key indicating the deletion was successful:
                                          
```  
{
"success": true
}
```


### Get User Info
__Purpose:__ Get general information about the currently logged in user

__Request Payload:__ None

__Response:__ A `UserInformation` object within a `user` key:

Example 1: User Can Upload

```  
{
  "user": {
    "user_type": "skater",
    "upload_file_capability": {
      "can_upload": true,
      "error_message": ""
    }
  }
}
```

Example 2: User Cannot Upload

```  
{
  "user": {
    "user_type": "skater",
    "upload_file_capability": {
      "can_upload": false,
      "error_message": "API-provided error message related to device support."
    }
  }
}
```