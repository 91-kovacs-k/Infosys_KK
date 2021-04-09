import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OvenManagementComponent } from './oven-management/oven-management.component';
import { AddPizzaComponent } from './add-pizza/add-pizza.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddCostumerComponent } from './add-costumer/add-costumer.component';
import { ModifyCostumerComponent } from './modify-costumer/modify-costumer.component';
import { DeleteCostumerComponent } from './delete-costumer/delete-costumer.component';

@NgModule({
  declarations: [AppComponent, OvenManagementComponent, AddPizzaComponent, AddCostumerComponent, ModifyCostumerComponent, DeleteCostumerComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
