import { Injectable } from '@angular/core';
import { TouchBarScrubber } from 'electron';
import { of, Observable, observable } from 'rxjs';
import { timingSafeEqual } from 'crypto';
import { ElectronService } from './electron.service';

var currentInstance;

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  mysqlConnection: any;
  sqlConnection: any;
  mysql: any;
  database: string;

  constructor(public electronService: ElectronService) {
    if (electronService.isElectron) {
      this.mysql = electronService.require('mysql');
      currentInstance = this;
      
      

      this.testMysqlServer();

      // if (this.mysql) {
      //   this.testSqlServer();
      //   this.testMysqlServer();
      // }
    }
  }

  testMysqlServer() {
    this.database = 'decrease';

    this.mysqlConnection = this.mysql.createConnection({
      host: 'localhost',
      user: 'decrease',
      password: 'decrease',
      database: this.database,
      port: 8082,
    });
    
    this.mysqlConnection.on('uncaughtException', function (err) {
      console.log(err);
    });

    this.mysqlConnection.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
      }
      console.log('connected as id ' + this.mysqlConnection.threadId);
    });
  }

  
  query(sql: string) {
    const queryObservable = new Observable(observer => {
      this.mysqlConnection.query(sql, (errors, results, fields) => {
        observer.next(results);
        if(errors) {
          observer.error(errors);
        }
      });
    })
    
    return queryObservable;
  }

  getCurrentDatabase() {
    return this.database;
  }



  testSqlServer() {
    var sql = window.require("mssql");

    var config = {
      user: `sa`,
      password: 'password',
      server: 'localhost\\SQLEXPRESS',
      database: 'oranges',
      port: '1433'
    };

    sql.connect(config, function (err) {

      if (err) console.log(err);

      var request = new sql.Request();
      request.query(currentInstance.getAllTablesQuerty('sql', config.database), (error, results) => {
        console.log(error, results);
      });
    });
  }


}