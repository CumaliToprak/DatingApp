import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent }, //path-component cifti yazılır. Order is important. Wildcard başta olsa hep aynı domaine gider mesela.
  { //bu yapı sayesinde bir AuthGuard sayesinde multiple route koruyoruz.
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'members', component: MemberListComponent , resolve: {users: MemberListResolver}},
      { path: 'members/:id', component: MemberDetailComponent, resolve :{user: MemberDetailResolver} }, // :id => route parametresini böyle tanımlarız.
      { path: 'messages', component: MessagesComponent },
      { path: 'lists', component: ListsComponent },
    ],
  },

  { path: '**', redirectTo: '', pathMatch: 'full' }, //joker: yukarıdakilerden herhangi biri ile eşleşmesse buraya yönledirilir.not: Angular first match mantığına göre çalışır. Hangi pathle eşleşirse oraya gider ilk.
];
