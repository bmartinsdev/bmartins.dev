import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AngularFireFunctions } from "@angular/fire/functions";
import { AngularFirestore } from "@angular/fire/firestore";
import { SnakeScore } from "functions/src/global/classes";

@Injectable({
  providedIn: "root",
})
export class SnakeService {
  private currentScore = new BehaviorSubject<number>(0);
  current$ = this.currentScore.asObservable();
  private recordScore = new BehaviorSubject<number>(0);
  score$ = this.recordScore.asObservable();
  private recordName = new BehaviorSubject<string>("");
  name$ = this.recordName.asObservable();
  private top10 = new BehaviorSubject<Score[]>([]);
  top10$ = this.top10.asObservable();

  constructor(public db: AngularFirestore, private fns: AngularFireFunctions) {}

  getTop10() {
    const top10doc = this.db.doc("users/snakeTop10").get();

    top10doc.subscribe({
      next: (top10: any) => {
        const ranking = top10.data().rank as Score[];
        this.top10.next(ranking);
        this.recordScore.next(ranking[0].score);
        this.recordName.next(ranking[0].name);
      },
    });
  }

  updateCurrent(score: number) {
    this.currentScore.next(score);
  }

  updateHighest(score: number, isSnake: boolean) {
    if (this.recordScore.getValue() > score) return;
    console.log("Trigger dialog");
  }
}

export interface Score {
  name: string;
  score: number;
}
