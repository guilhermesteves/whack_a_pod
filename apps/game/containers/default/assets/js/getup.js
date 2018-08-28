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

var RESET_NUMBER = 57; // it assumes the number 9 resets the pods

$(document).keypress(function(e) {
  var key = e.keyCode


  // is it a number?
  if (key >= 48 && key <= 57) {
    if (key === RESET_NUMBER) {
      console.log('Restarting...')
      $("#restart").click()
    } else {
      var pod = key - 48
      console.log('Killing pod', pod);
      $("#pod-" + pod).click()
    }
  } else {
    console.log('Key pressed is not a number =', key)
  }
});