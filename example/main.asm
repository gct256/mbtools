;;; macros

;;; rom header
	ORG	0x4000
	db	"AB"
	dw	START
	ds	12

;;; functions

;;; main
START:
	ld	a, 0
	ld	a, 1

	jr	$

JS_BOOL:
	include './js/booleanArray.js.inc'
JS_NUM:
	include './js/numberArray.js.inc'
JS_STR:
	include './js/stringArray.js.inc'
JS_ARY:
	include './js/typedArray.js.inc'

SPR_8:
	include './png/sample.msx_sprite_8.png.inc'
SPR_16:
	include './png/sample.msx_sprite_16.png.inc'
SC_2:
	include './png/sample.msx_screen_2.png.inc'
SC_2C:
	include './png/sample.msx_screen_2.png.colors.inc'

;;; work
WORK:	ORG	0xc000
	DB	0
	DB	0
