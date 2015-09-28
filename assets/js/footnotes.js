'use strict';

/*
	Compiled by Babel.js
*/

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Footnotes = (function () {

	function Footnotes() {

		_classCallCheck(this, Footnotes);

		var tag = document.getElementsByClassName('footnotes');

		if (!tag.length) {
			return;
		}

		var footnotes = tag[0].children[0].childNodes;

		for (var i = footnotes.length; i--;) {

			if (i % 2 !== 0) {

				var note = footnotes[i],
				    id = note.getAttribute('id').slice(-1),
				    origin = document.getElementById('fnref:' + id);

				note.getElementsByClassName('reversefootnote')[0].remove();

				this.spawnPlacebo(note, origin, id);
			}
		}

		this.popup = document.querySelector('.note');
	}

	_createClass(Footnotes, [{
		key: 'openNote',
		value: function openNote(me, event) {

			var popup = this.popup,
			    status = popup.classList.contains('shown');

			if (status) {

				var current = document.querySelector('[data-note].open');
				this.closeNote(current);
			}

			document.body.addEventListener('click', (function (event) {
				this.closeNote(me);
			}).bind(this));

			popup.innerHTML = me.getAttribute('data-note');

			setTimeout(function () {

				popup.className = popup.className + ' shown';

				popup.addEventListener('click', function (event) {
					event.stopPropagation();
				});
			}, 100);

			me.setAttribute('class', 'open');
		}
	}, {
		key: 'closeNote',
		value: function closeNote(ele) {

			this.popup.setAttribute('class', 'note');
			ele.removeAttribute('class');

			document.body.onclick = null;
		}
	}, {
		key: 'spawnPlacebo',
		value: function spawnPlacebo(note, ref, id) {

			var placebo = document.createElement('span'),
			    content = note.children[0].innerHTML,
			    it = this;

			placebo.setAttribute('data-note', content);
			placebo.innerHTML = id;

			placebo.addEventListener('click', function (event) {

				if (this.classList.contains('open')) {

					it.closeNote(this);
				} else {

					it.openNote(this, event);
				}

				event.stopPropagation();
			});

			ref.parentNode.replaceChild(placebo, ref);
		}
	}]);

	return Footnotes;
})();

new Footnotes();