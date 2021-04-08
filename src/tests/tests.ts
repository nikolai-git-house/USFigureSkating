/* eslint-disable */
import axios from "axios";
import {FetchCompetitionScheduleServiceResponse} from '../js/CompetitionSchedule/_contracts/CompetitionScheduleContracts';
import CompetitionService from "../js/services/CompetitionService";
import {CompetitionSchedule} from "../js/models/Competition/CompetitionSchedule";
import {SkaterService} from "../js/services/SkaterService";
import {
    PracticeIceSchedulesStateArgs,
    SkaterScheduleStateArgs
} from '../js/contracts/AppContracts';
import * as _ from "lodash";
import {AppService} from "../js/services/AppService";

function compare(obj1: any, obj2: any) {
    let comparison = _.isEqual(obj1, obj2);
    console.log('comparing:', comparison);
    return comparison;
}

function getCombinedData(competition_id: number): Promise<any> {
    return new Promise(function (resolve, reject) {
        axios.get('/api/competitions/' + competition_id + "/practice-ice-schedules").then(function (response) {
            resolve(response.data);
        });
    });
}

function getCompetitionScheduleData(competition_id: number) {
    return new Promise(function (resolve, reject) {
        axios.get('/api/competitions/' + competition_id + "/schedule").then(function (response) {
            resolve(response.data);
        });
    });
}

function getSkaterScheduleData(competition_id: number) {
    return new Promise(function (resolve, reject) {
        axios.get('/api/competitions/' + competition_id + "/skater-schedule").then(function (response3) {
            response3.data.scheduled_session_maps = response3.data.sessions.map(function (sessiondata: any) {
                sessiondata.session_id = sessiondata.session.id;
                delete sessiondata.session;
                return sessiondata;
            });
            delete response3.data.sessions;
            resolve(response3.data);
        });

    });
}

/**
 * Test that the Mock API endpoint for combined PI schedules returns the same data as the skater competition schedule
 * and competition schedule endpoints
 */
export function testPiData(competition_id: number) {
    getCombinedData(competition_id).then(function (combined_data) {
        getCompetitionScheduleData(competition_id).then(function (competition_schedule_data) {
            getSkaterScheduleData(competition_id).then(function (skater_schedule_data) {
                let old_result = {
                    competition_schedule: competition_schedule_data,
                    mapped_skater_schedule: skater_schedule_data
                }
                console.log({
                    old_result,
                    combined_data
                });
                if (!compare(old_result.competition_schedule, combined_data.competition_schedule)) {
                    console.log("Data NO Match mapped_skater_schedule");
                    return false;
                }
                if (!compare(old_result.mapped_skater_schedule, combined_data.mapped_skater_schedule)) {

                    console.log("Data NO Match mapped_skater_schedule");
                    console.log({
                        old_result: old_result.mapped_skater_schedule,
                        combined_data: combined_data.mapped_skater_schedule
                    });
                    return false;
                }
                console.log('DATA MATCH');
                return true;
            })
        })
    });
}

/**
 * Test that the output from the AppService.getPracticeIceSchedules returns the same app objects as
 * CompetitionService.getCompetitionSchedule and SkaterService.getCompetitionSchedule
 */
export function testPIProcess(competition_id: number) {

    AppService.getPracticeIceSchedules(competition_id).then(function (new_result) {
        CompetitionService.getCompetitionSchedule(competition_id).then(function (competition_result: FetchCompetitionScheduleServiceResponse) {
            const schedule = competition_result.schedule;
            if (schedule) {
                SkaterService.getCompetitionSchedule(competition_id).then(function (skater_result: SkaterScheduleStateArgs) {
                    let parsed_data: PracticeIceSchedulesStateArgs = {
                        competition_schedule: schedule,
                        skater_schedule_args: skater_result
                    };
                    if (!compare(new_result, parsed_data)) {
                        console.log('APP OBJECTS NO MATCH');
                        return false;
                    }
                    console.log('APP OBJECTS MATCH');
                    return true;
                });
            }
            console.log('SCHEDULE UNAVAILABLE');
            return false;
        });
    })


}