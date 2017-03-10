/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: selectall,toolbar,table,tabletools */

( function() {
	'use strict';

	bender.editor = {};

	function getRangesForCells( editor, cellsIndexes ) {
		var ranges = [],
			cells = editor.editable().find( 'td, th' ),
			range,
			cell,
			i;

		for ( i = 0; i < cellsIndexes.length; i++ ) {
			range = editor.createRange();
			cell = cells.getItem( cellsIndexes[ i ] );

			range.setStartBefore( cell );
			range.setEndAfter( cell );

			ranges.push( range );
		}

		return ranges;
	}

	var table = CKEDITOR.document.getById( 'table' ).findOne( 'table' );

	bender.test( {
		'test selectAll command after table selection (paragraph + table)': function() {
			var editor = this.editor,
				bot = this.editorBot,
				editable = editor.editable(),
				ranges;

			bot.setData( '<p>Sample text</p>' + table.getOuterHtml(), function() {
				ranges = getRangesForCells( editor, [ 1, 2 ] );

				editor.getSelection().selectRanges( ranges );

				editor.once( 'afterCommandExec', function() {
					resume( function() {
						ranges = editor.getSelection().getRanges();

						assert.areSame( 1, ranges.length, 'There is one range' );
						assert.areSame( 0, editable.find( '[class*=cke_table-faked-selection]' ).count(),
							'There are no fake selected cells' );
						assert.isFalse( editable.hasClass( '.cke_table-faked-selection-editor' ),
							'Editable does not have fake selection class' );
					} );
				} );

				editor.execCommand( 'selectAll' );
				wait();
			} );
		},

		'test selectAll command after table selection (only table)': function() {
			var editor = this.editor,
				bot = this.editorBot,
				editable = editor.editable(),
				ranges;

			bot.setData( table.getOuterHtml(), function() {
				ranges = getRangesForCells( editor, [ 1, 2 ] );

				editor.getSelection().selectRanges( ranges );

				editor.once( 'afterCommandExec', function() {
					resume( function() {
						ranges = editor.getSelection().getRanges();

						assert.areSame( 1, ranges.length, 'There is one range' );
						assert.areSame( 0, editable.find( '[class*=cke_table-faked-selection]' ).count(),
							'There are no fake selected cells' );
						assert.isFalse( editable.hasClass( '.cke_table-faked-selection-editor' ),
							'Editable does not have fake selection class' );
					} );
				} );

				editor.execCommand( 'selectAll' );
				wait();
			} );
		}
	} );
} )();
