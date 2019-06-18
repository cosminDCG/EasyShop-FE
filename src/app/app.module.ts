import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { NgxUiLoaderModule } from  'ngx-ui-loader';
import { NgxPayPalModule } from 'ngx-paypal';
import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { ChartsModule } from 'ng2-charts-x';

FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme)

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
import { RepPageComponent } from './rep-page/rep-page.component';
import { CategoryComponent } from './category/category.component';

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
    CheapestProdComponent,
    RepPageComponent,
    CategoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    Ng5SliderModule,
    BrowserAnimationsModule,
    AngularFontAwesomeModule,
    MatAutocompleteModule,
    ChartsModule,
    MatFormFieldModule,
    NgxPayPalModule,
    FusionChartsModule,
    NgxUiLoaderModule,
    MatInputModule,
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
    ReactiveFormsModule,
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
        path: 'dashboard/:category',
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
      },
      {
        path: 'items/categories',
        component: CategoryComponent
      },
      {
        path: 'user/rep',
        component: RepPageComponent
      }
    ])
  ],
  providers: [GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
