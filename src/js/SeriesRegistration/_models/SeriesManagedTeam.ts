import {ManagedTeam} from '../../Teams/_models';
import {ManagedTeamParameters} from '../../Teams/_models/ManagedTeam';
import {Teams} from '../../Teams/_contracts';
import {SeriesRegistration} from '../_contracts/SeriesRegistrationContracts';
import SelectTeamListComponentTeam = Teams.SelectTeamListComponentTeam;

interface Parameters extends ManagedTeamParameters {
    select_button: {
        text: string;
        url: string;
    } | null;

}

export class SeriesManagedTeam extends ManagedTeam implements SelectTeamListComponentTeam, SeriesRegistration.SelectableTeam {
    select_button: {
        text: string;
        url: string;
    } | null;

    constructor(params: Parameters) {
        super(params);
        this.select_button = params.select_button;
    }
}