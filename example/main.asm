;;; macros

;;; rom header
	ORG	0x4000
	db	"AB"
	dw	START
	ds	12

;;; functions

;;; main
START:
	di

	; 色
	ld	a, 0x0f
	ld	(0xf3e9), a
	ld	a, 0x01
	ld	(0xf3ea), a
	ld	a, 0x04
	ld	(0xf3eb), a
	call	0x0062

	; SCREEN 2
	call 0x0072

	; 16x16
	ld	a, (0xf3e0)
	or	0x42
	ld	b, a
	ld	c, 1
	call	0x0047

	; SCREEN2のパターン
	ld	bc, SC_2C - SC_2
	ld	de, 0x0000
	ld	hl, SC_2
	call	0x005c

	; ; SCREEN2の色
	ld	bc, DATA_ED - SC_2C
	ld	de, 0x2000
	ld	hl, SC_2C
	call	0x005c

	; スプライト
	ld	bc, SC_2 - SPR_8
	ld	de, 0x3800
	ld	hl, SPR_8
	call	0x005c

	ld	bc, SPR_ED - SPR_AT
	ld	de, 0x1b00
	ld	hl, SPR_AT
	call	0x005c

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
DATA_ED:

SPR_AT:
	DB	0x40, 0x00, 0, 0x0f
	DB	0x50, 0x10, 4, 0x0e
SPR_ED:

;;; work
WORK:	ORG	0xc000
