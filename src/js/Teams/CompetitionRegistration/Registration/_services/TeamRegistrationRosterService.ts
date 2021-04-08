export class TeamRegistrationRosterService {
    public static rosterFromIds<T extends { id: string; }>(roster: T[], selected_ids: string[]): T[] {
        return roster.filter((item: T) => {
            return selected_ids.indexOf(item.id) !== -1;
        });
    }
}