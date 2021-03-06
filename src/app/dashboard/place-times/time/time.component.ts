import {Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange, } from '@angular/core';
import { AdminService } from '../../../_services/admin.service';
import { Time } from '../Time';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnChanges, OnInit {

  @Input() time: Time;
  box_config = {'enable': true, 'reserved': false, 'reserving': false};
  box_status = '';
  is_from_admin = false;
  box_edit_state = false;
  incomplete_time_remain_num = 0;
  incomplete_time_desire_num = 0;
  new_price = 0;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.initTime();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initTime();
  }

  initTime() {
    this.box_config.enable = this.time.time_status !== 'disable';
    if (this.time.time_state === '0') {
      this.box_config.reserved = false;
      this.box_config.reserving = false;
    } else if (this.time.time_state === '1') {
      this.box_config.reserved = true;
      this.box_config.reserving = false;
    } else if (this.time.time_state === '2') {
      this.box_config.reserved = false;
      this.box_config.reserving = true;
      this.incomplete_time_remain_num = this.time.incomplete_time_remain_num;
      this.incomplete_time_desire_num = this.time.incomplete_time_desire_num;
    }
    if (this.time.from_admin === '1') {
      this.is_from_admin = true;
    }
    this.setTimeStatus();
  }

  setTimeStatus() {
    if (!this.box_config.enable) {
      this.box_status = 'disable';
    }
    if (this.box_config.enable && !this.box_config.reserved) {
      this.box_status = 'enable';
    }
    if (this.box_config.enable && this.box_config.reserved) {
      this.box_status = 'reserved';
    }
    if (this.box_config.reserving) {
      this.box_status = 'reserving';
    }
  }

  enableTime() {
    const time = [{'place_id': this.adminService.place_id, 'time_date': this.time.time_date, 'time_time': this.time.time_time,
      'time_price': this.time.time_price}];
    this.adminService.enableTime(time).subscribe(
      data => {
        console.log('enable-time response: \n', data);
        if (data['status'] === 200) {
          this.box_config.enable = true;
        }
        this.setTimeStatus();
      },
      error => {
        console.log('enable-time response error: \n', error);
      }
    );
  }

  disableTime() {
    const time = [{'place_id': this.adminService.place_id, 'time_date': this.time.time_date, 'time_time': this.time.time_time,
      'time_price': this.time.time_price}];
    this.adminService.disableTime(time).subscribe(
      data => {
        console.log('disable-time response: \n', data);
        if (data['status'] === 200) {
          this.box_config.enable = false;
          this.setTimeStatus();
        }
      },
      error => {
        console.log('disable-time response error: \n', error);
      }
    );
  }

  reserveTime() {
    const time = [{'place_id': this.adminService.place_id, 'time_date': this.time.time_date, 'time_time': this.time.time_time,
      'time_price': this.time.time_price, 'from_admin': '1'}];
    this.adminService.reserveTime(time).subscribe(
      data => {
        console.log('reserve-time response: \n', data);
        if (data['status'] === 200) {
          this.box_config.reserved = true;
          this.is_from_admin = true;
          this.setTimeStatus();
        }
      },
      error => {
        console.log('reserve-time response error: \n', error);
      }
    );
  }

  disableReserve() {
    const time = [{'place_id': this.adminService.place_id, 'time_date': this.time.time_date, 'time_time': this.time.time_time,
      'time_price': this.time.time_price}];
    this.adminService.disableReserve(time).subscribe(
      data => {
        console.log('disable-reserve response: \n', data);
        if (data['status'] === 200) {
          this.box_config.reserved = false;
          this.is_from_admin = false;
          this.setTimeStatus();
        }
      },
      error => {
        console.log('disable-reserve response error: \n', error);
      }
    );
  }

  enableEditState() {
    this.new_price = this.time.time_price;
    this.box_edit_state = true;
  }

  updateTime() {
    const time = [{'place_id': this.adminService.place_id, 'time_date': this.time.time_date, 'time_time': this.time.time_time,
      'time_price': this.new_price}];
    this.adminService.editTime(time).subscribe(
      data => {
        console.log('edit-time response: \n', data);
        if (data['status'] === 200) {
          this.time.time_price = this.new_price;
          this.box_edit_state = false;
        }
      },
      error => {
        console.log('edit-time response error: \n', error);
      }
    );
  }

}
