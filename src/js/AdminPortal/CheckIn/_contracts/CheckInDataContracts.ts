import {EventCategoryData} from '../../../contracts/data/DataContracts';
import {SavedMusicData} from '../../../contracts/data/MusicDataContracts';
import {CheckInSubEntitySkaterCoachData} from '../EntityCheckIn/_contracts/CheckInSubEntityDataContracts';

/**
 * Represents a check-in comment for an entity
 */
export interface CheckInEntityCommentData {
    author: string;                 // The name of the author of the comment
    comment: string;                // The text body of the comment
    datetime_formatted: string;     // The datetime to display for the comment
    id: number;                     // Unique identifier for the comment
}

/**
 * Represents an event a check-in entity is registered for.  Wraps one or more CheckInEventSegmentData items
 *
 * example from design assets: "Intermediate Teams"
 */
export interface CheckInEventData {
    id: number;                              // Unique identifier for the event
    name: string;                            // Name of the event
    segments: CheckInEventSegmentData[];     // The list of event segments belonging to the event.
}

/**
 * An event segment within an event for a check-in entity.  Contains Music/PPC information
 *
 * example from design assets: "Free"
 */
export interface CheckInEventSegmentData {
    event_id: number;                                           // The id of the parent CheckInEventData
    id: number;                                                 // Unique identifier for the segment
    music: SavedMusicData | null;                               // Music saved for the segment, if available
    music_required: boolean;                                    // Whether music is required for the segment
    music_status: CheckInEventSegmentRequirementStatusData;     // Information about the status for the segment's music relative to the check-in entity
    name: string;                                               // Name of the segment
    ppc: string[];                                              // PPC saved for the segment, if available
    ppc_required: boolean;                                      // Whether PPC is required for the segment
    ppc_status: CheckInEventSegmentRequirementStatusData;       // Information about the status for the segment's PPC relative to the check-in entity
}

/**
 * Represents the status of Music or PPC for a check-in entity's CheckInEventSegmentData
 */
export type CheckInEventSegmentRequirementStatusData = {
    completed: boolean;      // Whether the requirement is completed (Music/PPC has been assigned and completed)
    overridden: boolean;     // Whether the requirement has been overridden for check-in through the "viewed" checkbox
}

/**
 * Represents information about coaches assigned to a check-in skater's event categories
 *
 * Note: extends existing EventCategoryData structure, with the addition of a coaches property.
 * This structure is similar to the existing SkaterCoachedEventCategoryData structure, but the coaches property has a different
 * type
 */
export interface SkaterCompliantCoachedEventCategoryData extends EventCategoryData {
    coaches: CheckInSubEntitySkaterCoachData[];      // The list of coaches assigned to the event category
}