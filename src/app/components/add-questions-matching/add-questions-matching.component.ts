import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { QuestionsService } from 'src/app/services/questions.service';

@Component({
  selector: 'add-questions-matching',
  templateUrl: './add-questions-matching.component.html',
  styleUrls: ['./add-questions-matching.component.css'],
})
export class AddQuestionsMatchingComponent implements OnInit {
  @Output() addQuestion = new EventEmitter<any>();
  @Input() fromTest: boolean = false;
  @Input() questionEdit: any = {};

  array = Array;
  count;
  question: any = {};

  difficultyLevels: { id: number; name: string }[];
  constructor(
    private toastr: ToastrService,
    private questionService: QuestionsService
  ) {}

  ngOnInit(): void {
    if (!this.questionEdit.id) {
      this.question.answers = [];
      this.count = 4;
      this.question.questionType = 3;
      this.question.user = localStorage.getItem('userName');
    }

    this.difficultyLevels = this.questionService.getDifficutlyLevels();
  }

  ngOnChanges() {
    if (this.questionEdit) {
      this.question = this.questionEdit;
      this.question.questionType = 3;
      this.question.title = 'Match the options below: ';
      if (this.question.answers && this.question.answers.length) {
        this.count = this.question.answers.length;
      } else {
        this.question.answers = [];
        this.count = 4;
      }
    }
  }

  AddMoreAnswers() {
    this.count++;
  }

  RemoveAnswerFieds(i: number) {
    this.count--;
    if (this.question.answers.length > 0) {
      var xx = this.question.answers[i];
      this.question.answers.splice(i, 1);
    }
  }

  dataChanged(event, i, type) {
    if (type === 'name')
      this.question.answers[i] = Object.assign(this.question.answers[i] || {}, {
        name: event,
      });
    if (type === 'matchingText')
      this.question.answers[i] = Object.assign(this.question.answers[i] || {}, {
        matchingText: event,
      });
  }

  AddQuestion() {
    if (this.question.id) {
      this.UpdateQuestion();
    } else {
      if (this.question.answers.length > 0) {
        this.questionService.add(this.question).subscribe(
          (qid: any) => {
            if (this.fromTest) {
              this.question.id = qid;
              this.question.givenAnswerId = null;
              this.addQuestion.emit(this.question);
            }
            this.toastr.info('Matching Question Successfully Added');
            this.question = {};
            this.question.user = localStorage.getItem('userName');
            this.question.questionType = 3;
            this.question.answers = [];
          },
          (err) => {
            this.toastr.error(err);
          }
        );
      } else {
        this.toastr.error('Please add at lease one answer');
      }
    }
  }

  UpdateQuestion() {
    if (this.question.answers.length > 0) {
      this.questionService.update(this.question.id, this.question).subscribe(
        (qId: any) => {
          this.toastr.info('Question updated successfully ');
        },
        (err) => {
          this.toastr.error(err);
        }
      );
    } else {
      this.toastr.error('Please add at lease one answer');
    }
  }
}
