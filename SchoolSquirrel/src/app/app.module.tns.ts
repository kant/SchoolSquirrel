import {
    NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID,
} from "@angular/core";
import { NativeScriptModule, NativeScriptFormsModule, NativeScriptHttpClientModule } from "@nativescript/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { NativeScriptLoader } from "@danvick/ngx-translate-nativescript-loader";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { NativeScriptUICalendarModule } from "nativescript-ui-calendar/angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./_pages/home/home.component";
import { LoginComponent } from "./_pages/login/login.component";
import { AssignmentsComponent } from "./_pages/assignments/assignments.component";
import { CalendarComponent } from "./_pages/calendar/calendar.component";
import { UsersComponent } from "./_pages/_admin/users/users.component";
import { SettingsComponent } from "./_pages/_admin/settings/settings.component";
import { NavbarComponent } from "./_components/navbar/navbar.component";
import { SidebarComponent } from "./_components/sidebar/sidebar.component";
import { ToastComponent } from "./_components/toast/toast.component";
import { CoursesComponent } from "./_pages/courses/courses.component";
import { SelectUsersComponent } from "./_components/select-users/select-users.component";
import { CourseComponent } from "./_pages/course/course.component";
import { FullPageLoadingComponent } from "./_components/full-page-loading/full-page-loading.component";
import { ChatComponent } from "./_pages/chat/chat.component";
import { JwtInterceptor } from "./_interceptors/jwt.interceptor";
import { ErrorInterceptor } from "./_interceptors/error.interceptor";
import { HideActionBarDirective } from "./_directives/hideActionBar.directive";

export function nativescriptTranslateLoaderFactory(): NativeScriptLoader {
    return new NativeScriptLoader("./assets/i18n/", ".json");
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        ToastComponent,
        SidebarComponent,
        NavbarComponent,
        AssignmentsComponent,
        CalendarComponent,
        UsersComponent,
        SettingsComponent,
        CoursesComponent,
        SelectUsersComponent,
        CourseComponent,
        FullPageLoadingComponent,
        ChatComponent,
        HideActionBarDirective,
    ],
    imports: [
        ReactiveFormsModule,
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule,
        NativeScriptUISideDrawerModule,
        NativeScriptUICalendarModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: nativescriptTranslateLoaderFactory,
            },
            defaultLanguage: "de",
        }),
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true,
        },
        { provide: LOCALE_ID, useValue: "de-DE" },
    ],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
