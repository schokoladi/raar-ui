import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {BroadcastsService, AudioFilesService, DateParamsService} from '../shared/services/index';
import {AudioPlayerService} from './player/audio_player.service';
import {DatepickerComponent} from './datepicker/datepicker.component';
import {ShowsComponent} from './shows/shows.component';
import {BroadcastsShowComponent} from './broadcasts/broadcasts_show.component';
import {BroadcastsDateComponent} from './broadcasts/broadcasts_date.component';
import {PlayerComponent} from './player/player.component';

@Component({
  moduleId: module.id,
  selector: 'sd-archive',
  templateUrl: 'archive.html',
  providers: [BroadcastsService, AudioFilesService, AudioPlayerService],
  directives: [ROUTER_DIRECTIVES, DatepickerComponent, ShowsComponent, BroadcastsShowComponent,
              BroadcastsDateComponent, PlayerComponent]
})
export class ArchiveComponent {

  constructor() {}

}
