import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Profile } from 'src/app/models/profile.model';
import { Address } from 'src/app/models/address.model';
import { Subscription } from 'src/app/models/subscription.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  user: User;
  errorText = '';
  error = false;
  accepted = false;
  success = false;
  msg: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  registerWithFacebook() {
    console.log('future feature, hopefully');
  }

  register(form: NgForm) {
    console.log('beginning of the registration process');
    // make sure the user isn't trying to register while he's logged in
    if(!this.authService.isLogged()) {
      // prepare the user in the correct format for creation
      this.user = new User();
      this.user.username = form.controls.username.value;
      this.user.firstName = form.controls.firstName.value;
      this.user.lastName = form.controls.lastName.value;
      this.user.email = form.controls.email.value;
      this.user.password = form.controls.password.value;
      this.user.profile = new Profile();
      this.user.profile.address = new Address();
      this.user.subscription = new Subscription();

      // a little log for testing purposes
      console.log(this.user);

      this.authService.signup(this.user).subscribe(
        (result) => {
          this.error = false;
          this.success = true;
          console.log("##created_user## => ", result);
          this.router.navigateByUrl('/auth/login');
        },
        (error) => {
          if(error.status === 406) {
            this.error = true;
            this.errorText = error.error;
          }
        }
      );
    }    
  }

  closeSuccess() {
    this.success = false;
  }

}
