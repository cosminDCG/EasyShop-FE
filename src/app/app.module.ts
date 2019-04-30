import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { PopoverModule } from "ngx-smart-popover";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { Ng5SliderModule } from 'ng5-slider';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserPageComponent } from './user-page/user-page.component';
import { GlobalService } from './services/global-service/global.service';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { InboxComponent } from './inbox/inbox.component';
import { ProductComponent } from './product/product.component';
import { OnePlaceComponent } from './one-place/one-place.component';
import { CheapestProdComponent } from './cheapest-prod/cheapest-prod.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    MenuComponent,
    DashboardComponent,
    UserPageComponent,
    AdminPanelComponent,
    CartComponent,
    WishlistComponent,
    InboxComponent,
    ProductComponent,
    OnePlaceComponent,
    CheapestProdComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    Ng5SliderModule,
    BrowserAnimationsModule,
    AngularFontAwesomeModule,
    NgbModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD_UJkkF0mtrGAY2NJN6oMa2KjpYIvUMVI'
    }),
    LoadingBarModule,
    PopoverModule,
    ToastrModule.forRoot({
      timeOut: 1200,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    FormsModule,
    RouterModule.forRoot([
      {
        path: 'authentication',
        component: AuthenticationComponent
      },
      {
        path: 'menu',
        component: MenuComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'profile/:id',
        component: UserPageComponent
      },
      {
        path: 'user/admin',
        component: AdminPanelComponent
      },
      {
        path: 'user/cart',
        component: CartComponent
      },
      {
        path: 'user/wishlist',
        component: WishlistComponent
      },
      {
        path: 'item/:id',
        component: ProductComponent
      },
      {
        path: 'inbox/user/:id',
        component: InboxComponent
      },
      {
        path: 'buy/cheapest',
        component: CheapestProdComponent
      },
      {
        path: 'buy/single-place',
        component:OnePlaceComponent
      }
    ])
  ],
  providers: [GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
