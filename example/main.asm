;;; bios
WRTVDP	equ	0x0047
FILVRM	equ	0x0056
LDIRVM	equ	0x005c
CHGCLR	equ	0x0062
CLRSPR	equ	0x0069
INIGRP	equ	0x0072
GTTRIG	equ	0x00d8

; work
RG1SAV	equ	0xf3e0
FORCLR	equ	0xf3e9
BAKCLR	equ	0xf3ea
BDRCLR	equ	0xf3eb

;;; macros

;;; rom header
	ORG	0x4000
	db	"AB"
	dw	start
	ds	12

;;; functions

;;; wait key
wait_key:
	; save last status
	ld	a, (trigger)
	ld	(trigger + 1), a
	; check space bar
	xor	a
	call	GTTRIG
	; save current status
	ld	(trigger), a
	; if zero, start over
	or	a
	jr	z, wait_key
	; check last status
	ld	a, (trigger + 1)
	or	a
	ret	z
	jp	wait_key

;;; clear sprite generator
clear_sprite:
	ld	hl, 0x3800
	ld	bc, 0x0800
	xor	a
	call	FILVRM
	call	CLRSPR
	ret

;;; test for js2asm

;;; test for png2asm sprite_8
test_sprite_8:
	call	INIGRP
	call	clear_sprite

	; use 8x8, no zoom
	ld	a, (RG1SAV)
	and	11111101b
	ld	b, a
	ld	c, 1
	call	WRTVDP

	; load sprite
	ld	bc, sprite_8_end - sprite_8
	ld	de, 0x3800 ; sprite generator table
	ld	hl, sprite_8
	call	LDIRVM

	; put sprite
	ld	bc, sprite_8_attribute_end - sprite_8_attribute
	ld	de, 0x1b00 ; sprite attribute table
	ld	hl, sprite_8_attribute
	call	LDIRVM

	ret

;;; test for png2asm sprite_16
test_sprite_16:
	call	INIGRP
	call	clear_sprite

	; use 16x16, no zoom
	ld	a, (RG1SAV)
	or	00000010b
	ld	b, a
	ld	c, 1
	call	WRTVDP

	call	CLRSPR

	; load sprite
	ld	bc, sprite_16_end - sprite_16
	ld	de, 0x3800 ; sprite generator table
	ld	hl, sprite_16
	call	LDIRVM

	; put sprite
	ld	bc, sprite_16_attribute_end - sprite_16_attribute
	ld	de, 0x1b00 ; sprite attribute table
	ld	hl, sprite_16_attribute
	call	LDIRVM

	ret

;;; test for png2asm screen_2
test_screen_2:
	call	INIGRP
	call	clear_sprite

	; load pattern
	ld	bc, screen_2_end - screen_2
	ld	de, 0x0000 ; pattern name table
	ld	hl, screen_2
	call	LDIRVM

	; load color
	ld	bc, screen_2_color_end - screen_2_color
	ld	de, 0x2000 ; color table
	ld	hl, screen_2_color
	call	LDIRVM

	ret

;;; main
start:
	; init color
	ld	a, 0x0f
	ld	(FORCLR), a
	ld	a, 0x04
	ld	(BAKCLR), a
	ld	a, 0x07
	ld	(BDRCLR), a
	call	CHGCLR

loop:
	call	test_sprite_8
	call	wait_key
	call	test_sprite_16
	call	wait_key
	call	test_screen_2
	call	wait_key
	jp	loop

js_bool:
	include './js/booleanArray.js.inc'
js_bool_end:

js_num:
	include './js/numberArray.js.inc'
js_num_end:

js_str:
	include './js/stringArray.js.inc'
js_str_end:

js_array:
	include './js/typedArray.js.inc'
js_array_end:

sprite_8:
	include './png/sample.msx_sprite_8.png.inc'
sprite_8_end:

sprite_16:
	include './png/sample.msx_sprite_16.png.inc'
sprite_16_end:

screen_2:
	include './png/sample.msx_screen_2.png.inc'
screen_2_end:
screen_2_color:
	include './png/sample.msx_screen_2.png.colors.inc'
screen_2_color_end:

sprite_8_attribute:
	db	0x00, 0x00, 0, 0x02
	db	0x00, 0x10, 1, 0x05
	db	0x00, 0x20, 2, 0x08
	db	0x00, 0x30, 3, 0x0a
	db	0x10, 0x00, 0, 0x03
	db	0x10, 0x10, 1, 0x07
	db	0x10, 0x20, 2, 0x09
	db	0x10, 0x30, 3, 0x0b
sprite_8_attribute_end:

sprite_16_attribute:
	db	0x00, 0x00, 0, 0x02
	db	0x00, 0x20, 4, 0x05
	db	0x00, 0x40, 8, 0x08
	db	0x00, 0x60, 12, 0x0a
	db	0x20, 0x00, 0, 0x03
	db	0x20, 0x20, 4, 0x07
	db	0x20, 0x40, 8, 0x09
	db	0x20, 0x60, 12, 0x0b
sprite_16_attribute_end:

;;; work
my_work:
	ORG	0xc000

trigger:
	db	0, 0
