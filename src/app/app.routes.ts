import { Routes } from '@angular/router';
import { DepotSearchComponent } from './components/depot-search/depot-search.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about-us/about.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsComponent } from './components/terms/terms.component';

export const routes: Routes = [
  { path: '', component: DepotSearchComponent },
  { path: 'depot/:depot', component: DepotSearchComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-condition', component: TermsComponent },
  // legacy support: bare `/:depot` still works — keep it last so it doesn't shadow other routes
  { path: ':depot', component: DepotSearchComponent },
  // catch-all: redirect unknown paths to home
  { path: '**', redirectTo: '' },
];
