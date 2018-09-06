// Copyright 2018 GetupCloud. All Rights Reserved.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var GAME_INTERVAL = 300;
var SCORE_INTERVAL = 10;
var PODS_INTERVAL = 500;
var CLOCK_INTERVAL = 100;

var MOLES_ENDPOINT = 'http://192.168.13.37';

var RESET_NUMBER = 57; // it assumes the number 9 resets the pods

var molesStatus = new Array(9).fill(0, 0);

function MOLES() {

  var successHandler = function (data) {
    console.log('Pod down: '+ data)
  };

  var errorHandler = function (e, i) {
    console.log('Pod error: '+ e)
  };

  this.Status = function (i, pod) {
    var phase = pod.phase === 'running' ? 1 : 0;

    if (phase !== molesStatus[i]) { // status changed?
      molesStatus[i] = phase;
      console.log(phase === 1 ? 'Up:' : 'Down', i);

      var mole = { pod: i, val: phase };

      return new Promise(function (resolve) {
        return Promise.resolve($.post(MOLES_ENDPOINT, mole))
          .then(function () {
            console.log('Pod up: '+ mole.pod);
            return resolve();
          })
          .catch(function () {
            console.error('Error in Pod '+ mole.pod);

            molesStatus[i] = -1;
          })
      })
    }

    console.log('pod: ', JSON.stringify({
      position: pod.holder,
      phase: pod.phase,
      shortname: pod.shortname,
      ip: pod.hostIP
    }, null, 2));
  };

  this.ActiveReset = function () {
    var resetMole = {pod: 9, val: 1};
    return new Promise(function (resolve) {
      return Promise.resolve($.post(MOLES_ENDPOINT, resetMole))
        .then(function () {
          console.log('Reset Ok: ');
          return resolve();
        })
        .catch(function () {
          console.error('Error in Pod '+ resetMole.pod);
          return Promise.resolve($.post(MOLES_ENDPOINT, resetMole))
            .then(function () {
              return resolve()
            })
        })
    })
  };

  this.CleanMoles = function () {
    this.ActiveReset();

    var promises = [];

    for (let j = 0; j <= 8; j++) {
      promises.push({ pod: j, val: 0 });
    }

    Promise.each(promises, function (mole) {
      return new Promise(function (resolve) {
        console.log('Informing pod '+ mole.pod +' of shutdown');
        return Promise.resolve($.post(MOLES_ENDPOINT, mole))
          .then(function () {
            console.log('Pod down: '+ mole.pod);
            return resolve();
          })
          .catch(function () {
            console.error('Error in Pod '+ mole.pod);
            return resolve();
          })
      })
    })
  };

  this.KnockDown = function () {
    molesStatus = new Array(9).fill(0, 0);
    this.CleanMoles()
  };
};

var moles = new MOLES();
moles.CleanMoles();
moles.ActiveReset();

function restart() {
  moles.KnockDown();
  setTimeout(function () {
    location.reload()
  }, 3500);
}

$(document).keypress(function(e) {
  var key = e.charCode || e.keyCode;

  // is it a number?
  if (key >= 48 && key <= 57) {
    if (key === RESET_NUMBER) {
      console.log('Restarting...');
      restart();
    } else {
      var pod = key - 48;
      console.log('Killing pod', pod);
      $("#pod-" + pod + ' div:first').click();
    }
  } else {
    console.log('Key pressed is not a number =', key);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function () {
    $("#deploy-start").click();
  }, 2500);
});

