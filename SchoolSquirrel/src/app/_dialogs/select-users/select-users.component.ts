import {
    Component, OnInit, Input, Output, EventEmitter,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RemoteService } from "../../_services/remote.service";
import { User } from "../../_models/User";

@Component({
    selector: "app-select-users",
    templateUrl: "./select-users.component.html",
    styleUrls: ["./select-users.component.scss"],
})
export class SelectUsersComponent implements OnInit {
    public allUsers: User[] = [];
    public searchTerm = "";
    @Input() public placeholder = "";
    @Input() public users: User[] = [];
    @Output() public usersChange = new EventEmitter<User[]>();
    constructor(
        public modalService: NgbModal,
        private remoteService: RemoteService,
    ) { }

    public ngOnInit(): void {
        this.remoteService.get("users").subscribe((u) => {
            this.allUsers = u;
        });
    }

    public openModal(content: unknown): void {
        this.modalService.open(content).result.then(() => {
            this.usersChange.emit(this.users);
        }, () => this.usersChange.emit(this.users));
    }

    public getFilteredUsers(): User[] {
        return this.allUsers.filter((u) => u.name.toLowerCase()
            .indexOf(this.searchTerm.toLowerCase()) !== -1
            && !this.users.find((user) => user.id == u.id));
    }

    public removeUser(user: User): void {
        this.users = this.users.filter((u) => u.id !== user.id);
    }
}
