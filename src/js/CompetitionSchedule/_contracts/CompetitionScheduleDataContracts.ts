/**
 * Represents an abbreviation item in Competition Schedule Legend
 */
export type CompetitionScheduleLegendAbbreviationData = {
    label: string;      // The label/abbreviation for the item ("OPI")
    value: string;      // The definitions for the item ("Official Practice Ice")
}
/**
 * Represents a color key item in Competition Schedule Legend
 */
export type CompetitionScheduleLegendColorKeyItemData = {
    label: string;      // The label for the item ("Pairs")
    color: string;      // The css-compatible color for the item icon ("#3AB54B")
}
/**
 * Represents a legend for a competition schedule
 */
export type CompetitionScheduleLegendData = {
    abbreviations: CompetitionScheduleLegendAbbreviationData[];     // List of abbreviations and their meanings
    color_key: CompetitionScheduleLegendColorKeyItemData[];         // List of session item color key definitions
}
/**
 * Represents links associated with a competition schedule
 */
export type CompetitionScheduleLinksData = {
    download_schedule?: string;              // [OPTIONAL] Link to download the schedule
    competition_portal?: string;            // Link to Competition Portal Main Page for the competition.  Populates "Back" link on Competition Schedule Page.
    admin_edit?: string;                    // Link to admin edit page for the competition schedule.  Should not be included in response for non-admins to ensure link doesn't show
}