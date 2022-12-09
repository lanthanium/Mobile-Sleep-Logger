import { Component, OnInit } from '@angular/core';
import { SleepService } from '../services/sleep.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { format, parseISO } from 'date-fns';
import { async } from 'rxjs';

@Component({
  selector: 'app-sleepiness',
  templateUrl: './sleepiness.page.html',
  styleUrls: ['./sleepiness.page.scss'],
})
export class SleepinessPage implements OnInit {
timeString:string = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
levelString:string = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
sleepinessTime?:Date;
sleepinessTimeString: string; //to be passed into capacitor
currentLevel:number;
stanfordLog?: StanfordSleepinessData;

levelString1 = StanfordSleepinessData.ScaleValues[1];
levelString2 = StanfordSleepinessData.ScaleValues[2];
levelString3 = StanfordSleepinessData.ScaleValues[3];
levelString4 = StanfordSleepinessData.ScaleValues[4];
levelString5 = StanfordSleepinessData.ScaleValues[5];
levelString6 = StanfordSleepinessData.ScaleValues[6];
levelString7 = StanfordSleepinessData.ScaleValues[7];

addAnother: boolean = false;
defaultButton: boolean = true;


  constructor(private sleepService: SleepService) { }



  /*********************************************************************************************
   * This function resets the fields and page to the default mode
   * The &nbsp is just for stylistic purposes only
   **********************************************************************************************/
  addAnotherEntry():void{
    this.timeString = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    this.levelString = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    this.defaultButton = true;
    this.addAnother = false;
  }



  /*********************************************************************************************
   * This function gets the time/date value from the ion datetime modal and passes it into
   * a string to be displayed back on the page to the user in a readable format, and than
   * creates a new Date object from the time string that the modal passed
   **********************************************************************************************/
  timeChanged(time):void 
  {
    this.timeString = format(parseISO(time), 'PPpp');
    this.sleepinessTimeString = time;
    this.sleepinessTime = new Date(time); //time is in string, new Date() converts it into a Date Object
    console.log(this.sleepinessTime);
    console.log(time);
  }



  /*********************************************************************************************
   * This function function populates the page to display back to the user what they selected
   * Then it uses the passed int value that the user chose which will eventually be used
   * to pass create a new StanfordSleepinessData object, which will be used to push to Preference
   * and AllStanfordSleepinessData array
   **********************************************************************************************/
  levelSelect(value: number) : void
  {
    this.levelString = '' + value + ': ' + StanfordSleepinessData.ScaleValues[value];
    this.currentLevel = value;
  }



  /*********************************************************************************************
   * Called when a user confirms and clicks the Add to Diary button.  Function will edit the page
   * to display that the user sent data, and then add the Stanford data to SleepService/Preference
   **********************************************************************************************/
  logSummary = async() => 
  {
    if (this.levelString == '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' || this.timeString == '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') return;
    else
    {
      this.defaultButton = false;
      this.addAnother = true;
      this.stanfordLog = new StanfordSleepinessData(this.currentLevel, this.sleepinessTime); 
      await this.sleepService.addStanfordToPreferences(this.stanfordLog);
    }
  }

  ngOnInit() {

  }

}
