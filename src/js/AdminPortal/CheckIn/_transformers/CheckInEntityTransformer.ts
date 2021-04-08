/* eslint-disable jsdoc/require-jsdoc */
import {CheckInEntityInstance} from '../_contracts/CheckInEntityContracts';
import {
    CheckInEntityBaseData,
    CheckInEntityCoachData,
    CheckInEntityCompetitionContactData,
    CheckInEntityInstanceData,
    CheckInEntityOfficialData,
    CheckInEntitySkaterData,
    CheckInEntityTeamCoachData,
    CheckInEntityTeamData,
    CheckInEntityTeamServicePersonnelData,
    CheckInEntityVolunteerData
} from '../_contracts/CheckInEntityDataContracts';
import {CheckInEntityBaseParameters} from '../_models/CheckInEntities/AbstractCheckInEntity';
import {CheckInEntityCoach} from '../_models/CheckInEntities/CheckInEntityCoach';
import {CheckInEntityCompetitionContact} from '../_models/CheckInEntities/CheckInEntityCompetitionContact';
import {CheckInEntityOfficial} from '../_models/CheckInEntities/CheckInEntityOfficial';
import {CheckInEntitySkater} from '../_models/CheckInEntities/CheckInEntitySkater';
import {CheckInEntityTeam} from '../_models/CheckInEntities/CheckInEntityTeam';
import {CheckInEntityTeamCoach} from '../_models/CheckInEntities/CheckInEntityTeamCoach';
import {CheckInEntityTeamServicePersonnel} from '../_models/CheckInEntities/CheckInEntityTeamServicePersonnel';
import {CheckInEntityVolunteer} from '../_models/CheckInEntities/CheckInEntityVolunteer';

interface CheckInEntityTransformerInterface {
    [key: string]: any;
}

export class CheckInEntityTransformer {
    [key: string]: (data: CheckInEntityInstanceData) => CheckInEntityInstance;

    /**
     * Create the correct CheckInEntityInstance from its CheckInEntityInstanceData
     */
    static _entity(data: CheckInEntityInstanceData): CheckInEntityInstance {
        const entity_type_key = data.entity_type_key;
        if (entity_type_key in CheckInEntityTransformer) {
            // eslint-disable-next-line
            const method = (CheckInEntityTransformer as CheckInEntityTransformerInterface)[entity_type_key];
            if (typeof method === 'function') {
                return method(data);
            }
        }
        console.error('Invalid CheckInEntityTransformer method call');
        throw 'invalid method call';
    }

    static coach(data: CheckInEntityCoachData): CheckInEntityCoach {
        return new CheckInEntityCoach({
            ...CheckInEntityTransformer.core(data),
            email: data.email,
            personal_schedule_url: data.personal_schedule_url,
            phone: data.phone,
            skater_count: data.skater_count
        });
    }

    static competition_contact(data: CheckInEntityCompetitionContactData): CheckInEntityCompetitionContact {
        return new CheckInEntityCompetitionContact({
            ...CheckInEntityTransformer.core(data),
            email: data.email,
            phone: data.phone
        });
    }

    static core(data: CheckInEntityBaseData): CheckInEntityBaseParameters {
        return {
            check_in_status: data.check_in_status,
            club: data.club,
            comment_count: data.comment_count,
            eligible: data.eligible,
            id: data.id,
            lts_summary: data.lts_program ? {
                description: data.lts_program
            } : null,
            member_number: data.member_number,
            membership_status: data.membership_status,
            name: data.name
        };

    }

    static official(data: CheckInEntityOfficialData): CheckInEntityOfficial {
        return new CheckInEntityOfficial({
            ...CheckInEntityTransformer.core(data),
            email: data.email,
            phone: data.phone
        });
    }

    static skater(data: CheckInEntitySkaterData): CheckInEntitySkater {
        return new CheckInEntitySkater({
            ...CheckInEntityTransformer.core(data),
            coach_count: data.coach_count,
            events_complete: data.events_complete,
            outstanding_fees: data.outstanding_fees,
            personal_schedule_url: data.personal_schedule_url,
            unpaid_events: data.unpaid_events
        });
    }

    static team(data: CheckInEntityTeamData): CheckInEntityTeam {
        return new CheckInEntityTeam({
            ...CheckInEntityTransformer.core(data),
            coach_count: data.coach_count,
            events_complete: data.events_complete,
            outstanding_fees: data.outstanding_fees,
            roster_count: data.roster_count,
            team_level: data.team_level,
            team_service_personnel_count: data.team_service_personnel_count,
            unpaid_events: data.unpaid_events
        });
    }

    static team_coach(data: CheckInEntityTeamCoachData): CheckInEntityTeamCoach {
        return new CheckInEntityTeamCoach({
            ...CheckInEntityTransformer.core(data),
            email: data.email,
            personal_schedule_url: data.personal_schedule_url,
            phone: data.phone
        });
    }

    static team_personnel(data: CheckInEntityTeamServicePersonnelData): CheckInEntityTeamServicePersonnel {
        return new CheckInEntityTeamServicePersonnel({
            ...CheckInEntityTransformer.core(data),
            email: data.email,
            phone: data.phone
        });
    }

    static volunteer(data: CheckInEntityVolunteerData): CheckInEntityVolunteer {
        return new CheckInEntityVolunteer({
            ...CheckInEntityTransformer.core(data),
            email: data.email,
            personal_schedule_url: data.personal_schedule_url,
            phone: data.phone
        });
    }
}