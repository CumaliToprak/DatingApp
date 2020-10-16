import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss'],
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm', { static: true }) editForm: NgForm; //editForm'a ulaşıp state ni restore etmek için bunu eklememiz gerekir.
  user: User;
  photoUrl: string;
  @HostListener('window:beforeunload', ['$event']) //web sitesi tabı kapatılmak istendiğinde değişiklik yapılmışsa uyarı popun'ının görünmesi için.
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private router: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.router.data.subscribe((data) => {
      this.user = data['user'];
    });
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  updateUser() {
    this.userService
      .updateUser(this.authService.decodedToken.nameid, this.user)
      .subscribe(
        (next) => {
          this.alertify.success('Profile updated successfully');
          this.editForm.reset(this.user); //formda bilgiler update edildikten sonra reset işlemi için.
          //reset işleminden sonra updated user valueların görüntülenmesi içn userı parametre olarak veririz.
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  updateMainPhoto(photoUrl){
    this.user.photoUrl = photoUrl;
  }

}
