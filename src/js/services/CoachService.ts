import axios from "axios";
import {CoachResult, CoachSkater, MyCoachesSearchParameters, FormOption} from "../contracts/AppContracts";
import {CoachSkatersAdaptor} from "../adaptors/CoachSkatersAdaptor";
import {CoachAdaptor} from "../adaptors/CoachAdaptor";
import {CoachSkatersSchedule} from "../models/Schedule/CoachSkatersSchedule";
import {CoachSkaterScheduleAdaptor} from "../adaptors/CoachSkaterScheduleAdaptor";

export class CoachService {

    /**
     * @deprecated 2020-07-28
     */
    static fetchCompetitionSkaters(competition_id: number): Promise<CoachSkater[]> {
        return new Promise<CoachSkater[]>(function (resolve, reject) {
            axios.get('/api/competitions/' + competition_id + '/coach-skaters').then(function (response) {
                if (response.data.skaters) {
                    let result = CoachSkatersAdaptor.adaptArray(response.data.skaters);
                    resolve(result);
                }
                reject();
            }).catch(function () {
                reject();
            })
        });
    }

    /**
     * Search for coaches
     */
    static coachSearch(search_params: MyCoachesSearchParameters): Promise<CoachResult[]> {
        return new Promise(function (resolve, reject) {
            axios.post('/api/coaches/search', search_params).then(function (response) {
                if (response.data.coaches) {
                    resolve(CoachAdaptor.adaptCoachResultArray(response.data.coaches));
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    static fetchStateOptions(): Promise<FormOption[]> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/coach-state-options').then(function (response) {
                if (response.data.state_options) {
                    resolve(response.data.state_options);
                    return;
                }
                reject();
            }).catch(function () {
                reject();
            })
        });
    }

    /**
     * Fetch the CoachSkatersSchedule for the competition
     *
     * @deprecated 2020-07-29
     */
    static fetchCompetitionSkaterSchedule(competition_id: number): Promise<CoachSkatersSchedule> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/competitions/' + competition_id + '/coached-skater-schedule').then(function (response) {
                if (response.data.sessions && response.data.skater_session_map) {
                    resolve(CoachSkaterScheduleAdaptor.adapt(response.data.sessions, response.data.skater_session_map));
                    return;
                }
                reject();
            }).catch(function () {
                reject();
            })
        });
    }
}