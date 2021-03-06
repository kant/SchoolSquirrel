import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { RemoteService } from "../../_services/remote.service";
import { Assignment } from "../../_models/Assignment";
import { AuthenticationService } from "../../_services/authentication.service";
import { FastTranslateService } from "../../_services/fast-translate.service";

type Tab = "student" | "teacher" | "submissions";

@Component({
    selector: "app-assignment",
    templateUrl: "./assignment.component.html",
    styleUrls: ["./assignment.component.scss"],
})
export class AssignmentComponent {
    public assignment: Assignment;
    public activeTab: Tab = "student";
    public showSubmissionMessageField = false;
    public submissionMessage = "";
    public currentSubmissionIdx: number;
    public selectedFileUrl: string;
    public feedback = "";

    constructor(
        public authenticationService: AuthenticationService,
        private remoteService: RemoteService,
        private modalService: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        private fts: FastTranslateService,
    ) { }

    public ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.activeTab = params.tab || "student";
            if (parseInt(params.id, 10) != this.assignment?.id) {
                this.assignment = undefined;
                this.remoteService.get(`assignments/${params.id}`).subscribe((data: Assignment) => {
                    this.assignment = data;
                });
            }
        });
    }

    public removePrefix(url: string): string {
        if (!url) {
            url = "";
        }
        const parts = url.split("/");
        parts.shift();
        return parts.join("/");
    }

    public tabChanged(tab: Tab): void {
        this.router.navigate(["/assignments", this.assignment.id, tab]);
    }

    public async submitAssignment(): Promise<void> {
        if (this.assignment.worksheets.filter((w) => !w.worksheetHasAlreadyBeenEdited).length) {
            // eslint-disable-next-line
            if (!confirm(await this.fts.t("pages.assignments.notAllWorksheetsEdited") as string)) {
                return;
            }
        }
        if (!this.assignment.submissions?.length && !this.submissionMessage.trim()) {
            // eslint-disable-next-line
            if (!confirm(await this.fts.t("pages.assignments.noFilesAttachedAndNoMessageWritten") as string)) {
                return;
            }
        }
        this.remoteService.post(`assignments/${this.assignment.id}/submit`, { message: this.submissionMessage }).subscribe((d) => {
            if (d.success) {
                this.assignment.submitted = new Date();
            }
        });
    }

    public async unsubmitAssignment(): Promise<void> {
        // eslint-disable-next-line
        if (!confirm(await this.fts.t("pages.assignments.doYouReallyWantToUnsubmit") as string)) {
            return;
        }
        this.remoteService.post(`assignments/${this.assignment.id}/unsubmit`, {}).subscribe((d) => {
            if (d.success) {
                this.assignment.submitted = undefined;
            }
        });
    }

    public async returnAssignment(): Promise<void> {
        // eslint-disable-next-line
        if (!this.feedback.trim() && !confirm(await this.fts.t("pages.assignments.reallyReturnWithoutFeedback") as string)) {
            return;
        }
        this.remoteService.post(`assignments/${this.assignment.id}/return/${this.assignment.userSubmissions[this.currentSubmissionIdx].user.id}`, { feedback: this.feedback }).subscribe((d) => {
            if (d.success) {
                this.assignment.userSubmissions[this.currentSubmissionIdx].returned = new Date();
                this.assignment.userSubmissions[this.currentSubmissionIdx]
                    .feedback = this.feedback.trim();
            }
        });
    }
}
