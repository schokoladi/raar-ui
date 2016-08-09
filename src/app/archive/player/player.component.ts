import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {ISubscription} from 'rxjs/Subscription';
import {AudioPlayerService} from './audio_player.service';
import {AudioFilesService, BroadcastsService, DateParamsService} from '../../shared/services/index';
import {AudioFileModel, BroadcastModel} from '../../shared/models/index';
import {BroadcastTimePipe} from '../../shared/pipes/broadcast_time.pipe';


@Component({
  moduleId: module.id,
  selector: 'sd-player',
  templateUrl: 'player.html',
  providers: [],
  directives: [],
  pipes: [BroadcastTimePipe]
})
export class PlayerComponent {

  private paramsSub: ISubscription;

  constructor(private player: AudioPlayerService,
              private audioFilesService: AudioFilesService,
              private broadcastsService: BroadcastsService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    const state = this.router.routerState;
    const broadcastRoute = state.firstChild(state.firstChild(state.root));
    if (!broadcastRoute) return;
    this.paramsSub = broadcastRoute.params
      .distinctUntilChanged()
      .subscribe(params => this.handleRouteParams(params));
  }

  ngDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

  get audioFile(): AudioFileModel {
    return this.player.audioFile;
  }

  get broadcast(): BroadcastModel {
    if (!this.audioFile) return undefined;
    return this.audioFile.relationships.broadcast;
  }

  togglePlay() {
    if (!this.player.audioFile) return;
    if (this.player.playing) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  private handleRouteParams(params: { [key: string]: any }) {
    if (params['time'] && params['play'] && params['format']) {
      const time = DateParamsService.timeFromParams(params);
      if (this.isCurrentBroadcast(time)) {
        if (!this.isCurrentAudioFile(params['play'], params['format'])) {
          this.player.play(this.buildAudioFile(this.broadcast, time, params['play'], params['format']));
        }
      } else {
        this.broadcastsService.getForTime(time).subscribe(broadcast => {
          this.player.play(this.buildAudioFile(broadcast, time, params['play'], params['format']));
        });
      }
    }
  }

  private isCurrentBroadcast(date: Date): boolean {
    return this.broadcast &&
        this.broadcast.attributes.started_at <= date &&
        this.broadcast.attributes.finished_at > date
  }

  private isCurrentAudioFile(playbackFormat: string, codec: string): boolean {
    return this.audioFile &&
      this.audioFile.attributes.codec === codec &&
      this.audioFile.attributes.playback_format === playbackFormat;
  }

  private buildAudioFile(broadcast: BroadcastModel,
                         time: Date,
                         playbackFormat: string,
                         codec: string): AudioFileModel {
    const model = new AudioFileModel();
    model.attributes.codec = codec;
    model.attributes.playback_format = playbackFormat;
    model.attributes.url = this.audioFilesService.buildUrl(time, playbackFormat, codec);
    model.relationships.broadcast = broadcast;
    return model;
  }

}
