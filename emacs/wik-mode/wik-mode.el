;; WIK MODE - VARS

;; This is a hack to get M-<up>, M-<down> working
;; which will allow the wik-mode-map keybinding for
;; these commands:
;;   M-S-<up>   (wik-close-file)
;;   M-S-<down> (wik-open-file-at-point)
(define-key input-decode-map "\e\eOA" [(meta up)])
(define-key input-decode-map "\e\eOB" [(meta down)])
(define-key input-decode-map "\e\eOC" [(meta n)])
(define-key input-decode-map "\e\eOD" [(meta *)]) ;(kbd "M-*"))
;;(define-key input-decode-map "\e\eOD" (kbd "M-*"))
;;(define-key input-decode-map "\e\eOD" [(meta 8)]) ;(kbd "M-*"))
;;(define-key input-decode-map (kbd "M-n")  (kbd "<meta-n>"))

;; overrideable variables
;(setq wik-file-path-begin-regexp "[ \n][{\\[]?"); "[ \n][\\{{\\[]?"
(setq wik-file-path-begin-regexp "[\" \n][{\\[]?"); "[ \n][\\{{\\[]?"
;(setq wik-file-path-end-regexp "[.,;\\)}a-zA-Z0-9]?[ \n]"); spaces must be marked in region  ; "[.,;\\)}\\]a-zA-Z0-9]?[ \n]"
;;;; (setq wik-outline-regexp "[\/]*[#]*[ ]*[A-Z][A-Z]")
(setq wik-file-path-end-regexp "[.,;\\)}a-zA-Z0-9]?[\" \n]"); spaces must be marked in region
(setq wik-outline-regexp "[-;\/# \*<!>]*[A-Z][A-Z]")  ;; - has to be at start,
                                                      ;; otherwise escape it

;;(setq wik-outline-heading-end-regexp "[A-Z0-9 _*\n]+[A-Z0-9 _*]\n")
;;;(setq wik-outline-heading-end-regexp "[A-Z0-9 _*\n]+[\/]*[#]*[ ]*[A-Z0-9 _*][A-Z0-9 _*]\n")
;;;; (setq wik-outline-heading-end-regexp "[\/]*[#]*[ ]*[A-Z0-9 _*][A-Z0-9 _*]\n")
;;;;; (setq wik-outline-heading-end-regexp "[\/# \*<!->]*[A-Z][A-Z][\/# \*<!->0-9_-]*\n")
;;;;;;(setq wik-outline-heading-end-regexp "[A-Z][A-Z][-\/# \*<!>0-9_]*\n")
;;;;;;;(setq wik-outline-heading-end-regexp "[A-Z][A-Z][-\/# \*<!>0-9_]*(?html)?[>]?\n")
(setq wik-outline-heading-end-regexp "[A-Z][A-Z][ ]?[h]?[t]?[m]?[l]?[-\/# \*<!>0-9_]*\n")

(setq wik-kbd-wik-move-to-file "M-S-<left>")
(setq wik-kbd-wik-move-from-file "M-S-<right>")
(setq wik-kbd-wik-open-file-at-point "M-S-<down>") ;"M-S-<down>"
(setq wik-kbd-wik-close-file "M-S-<up>") ; "M-S-<up>"
(setq wik-kbd-wik-repeat-heading "M-S-<return>")

;;(defvar wik-mode-map nil "Keymap for `wik-mode'")
(setq wik-mode-map (make-sparse-keymap))

;; WIK MODE - OUTLINE MODE DERIVATION
(define-derived-mode wik-mode outline-mode "WIK"
  (setq case-fold-search nil)
  (setq outline-regexp wik-outline-regexp)
  (setq outline-heading-end-regexp wik-outline-heading-end-regexp)
  (define-key wik-mode-map (kbd wik-kbd-wik-move-to-file) 'wik-move-to-file)
  (define-key wik-mode-map (kbd wik-kbd-wik-move-from-file) 'wik-move-from-file)
  (define-key wik-mode-map (kbd wik-kbd-wik-open-file-at-point) 'wik-open-file-at-point)
  (define-key wik-mode-map (kbd wik-kbd-wik-close-file) 'wik-close-file)
  (define-key wik-mode-map (kbd wik-kbd-wik-repeat-heading) 'wik-repeat-heading)
  ;;(define-key wik-mode-map (kbd "M-S-n") 'outline-next-heading)
  (define-key wik-mode-map [(meta shift n)] 'wik-next-heading) ; 'outline-next-heading)
  (define-key wik-mode-map [(meta shift p)] 'wik-previous-heading) ;'outline-previous-heading)
  (define-key wik-mode-map (kbd "M-#") 'wik-previous-heading) ;'outline-previous-heading)

  (define-key wik-mode-map [(meta *)] 'wik-all-heading-collapse) ;;if same point then toggle all?
  ;;(define-key wik-mode-map (kbd "M-S-*") 'wik-all-heading-collapse) ;;if same point then toggle all?
  ;;(define-key wik-mode-map (kbd "M-*") 'wik-all-heading-expand)
  (define-key wik-mode-map [(meta shift a)] 'wik-all-heading-expand)
  (define-key wik-mode-map [(meta shift o)] 'wik-outline-entry-toggle)
  (define-key wik-mode-map [(tab)] 'wik-indent)
  (define-key wik-mode-map [(return)] 'wik-nl)
  (define-key wik-mode-map [(meta shift f)] 'wik-find-file)
  )



;; (add-to-list 'auto-mode-alist '("/READ*\\'" . wik-mode))

(add-to-list 'auto-mode-alist '("\\.wik\\'" . wik-mode))

;; WIK MODE - FUNCTIONS
(defun wik-indent ()
  (interactive)
  (insert "    ")
  )

(defun wik-nl ()
  (interactive)
  (insert "\n")
  )

(defun wik-find-file ()
  (interactive)
  (find-file (read-file-name "Find Wik: "))
  (wik-mode)
  )

(defun wik-move-to-file ()
  (interactive)
  (let ((yanked nil) (file-name ".untitled"))
    (if (use-region-p)
	(progn
	  (kill-region (region-beginning) (region-end))
	  (setq yanked t)))
    (setq file-name (read-file-name "move to file:"))
    (insert file-name)
    (find-file-other-window file-name)
    (if (eq yanked t)
	(progn
	  (goto-char (point-max))
	  (insert "\n")
	  (yank)
	  (message "done"))
      (message "done"))
    )
  )

(defun wik-move-from-file ()
  (interactive)
  (let ((file-name ".untitled") (file-name-begin -99) (file-name-end))
    (re-search-forward wik-file-path-end-regexp)
    (backward-char)
    (setq file-name-end (point)) ;
    (re-search-backward wik-file-path-begin-regexp)
    (forward-char)
    (setq file-name-begin (point)) ;
    (setq file-name (buffer-substring
		     file-name-begin file-name-end)
	  ) ;
    (kill-region file-name-begin file-name-end)
    (insert-file-contents file-name)
    ;(delete-file file-name)
    (message (concat "done. " file-name " was deleted"))
    )
  )

(defun wik-open-file-at-point ()
  (interactive)

  (let ((left-pt (point)) (right-pt (point)) (begin-pt -99) (end-pt -99)
	(file-name ".untitled"))
    (if (use-region-p)
	(progn
	  (setq left-pt (region-beginning))
	  (setq right-pt (region-end))
	  )
      )
    (goto-char right-pt)
    (re-search-forward wik-file-path-end-regexp)
    (backward-char)
    (setq test (number-to-string (char-after (point))))
    (if (char-equal (char-after (- (point) 1)) 46) ; 46 = .
	(backward-char)
      )
    (if (char-equal (char-after (- (point) 1)) 34) ; 46 = "
	(backward-char)
	)
    (setq end-pt (point)) ;
    (goto-char left-pt)
    (re-search-backward wik-file-path-begin-regexp)
    (forward-char)
    (setq begin-pt (point)) ;
    (setq file-name (buffer-substring begin-pt end-pt))

    (if (string-match-p "^\\./" file-name)
        ;; remove preceding ./ to make fallback folder ref substitution easier
        (setq file-name (substring file-name 2 nil))
    )
    (if (not (file-exists-p file-name))
        ;; fallback folder reference substitution
        (setq
            file-name
            (concat
                (with-temp-buffer
                    (insert-file-contents (nth 0 (split-string file-name "/")))
                    (buffer-substring-no-properties
                        (point-min)
                        (- (point-max) 1) ;; emacs (default) saves w/ newline
                    )
                )
                (substring
                    file-name
                    (length (nth 0 (split-string file-name "/")))
                    nil
                )
            )
        )
    )

    (find-file-other-window file-name)
    
    (message test)
    )
    (wik-mode)
  )

(defun wik-close-file ()
  (interactive)
  (kill-this-buffer)
  (if (cdr (window-list))
      (delete-window)
    )
  )

;; WIK MODE - FUNCTIONS - WIK-REPEAT-HEADING
(defun wik-repeat-heading ()
  (interactive)
  (let ( (heading-begin (point)) (heading-end (point)) )
    (save-excursion
      ;;(outline-previous-heading)
      ;;(outline-previous-heading)
      (wik-previous-heading)
      (setq heading-begin (point))
      (re-search-forward wik-outline-heading-end-regexp)
      (setq heading-end (point))

      ;; calc heading end point if multiline
      (setq heading-line-first (line-number-at-pos))
      (setq heading-line-last (line-number-at-pos))
      (while (string-equal (number-to-string heading-line-first) (number-to-string heading-line-last))
        (progn
          (if (re-search-forward wik-outline-heading-end-regexp nil t)
            (setq heading-line-last (line-number-at-pos))
            (setq heading-line-last -99))
          
          (if (string-equal (number-to-string heading-line-first) (number-to-string heading-line-last))
              (setq heading-line-last -99)
              (if (string-equal (number-to-string (+ heading-line-first 1)) (number-to-string heading-line-last))
                (progn (setq heading-end (point)) (setq heading-line-first (line-number-at-pos)))
                (setq heading-line-last -99))
          )
        )
      )
    )
    ;;;;(outline-next-heading)

    ;(if (eq (- (char-after (point)) 1) "\n")
    ;(if (eq (char-after (- (point) 1)) 10)
    (if (eq (char-after (- (point) 1)) 10)
	 nil (progn (insert "\n")))
    (insert (buffer-substring heading-begin heading-end))
    ;;(insert (concat "\n" (buffer-substring wik-repeat-heading-begin wik-repeat-heading-end)))
    ;;  )
    (delete-backward-char 1)
    ;;;;(insert "\n")
    ;;;;(backward-char)
    ;;;;(backward-char)
    )
  )

(defun wik-all-heading-expand ()
  (interactive)
  (outline-show-all)
  )

(defun wik-all-heading-collapse ()
  (interactive)
  (let ( (collapse-pt (point-max)) )
    (save-excursion
      (goto-char 1)
      (re-search-forward wik-file-path-begin-regexp)
      (re-search-forward wik-file-path-end-regexp)
      (while (not (= (point) collapse-pt))
	(outline-hide-entry)
	(setq collapse-pt (point))
	(forward-line)
	)
      )
    )
  )

(defun wik-next-heading ()
  (interactive)
  ;; (end-of-line)
  ;; (re-search-backward (concat "^" wik-outline-regexp) nil t)
  ;; (re-search-forward wik-outline-heading-end-regexp)
  ;; (beginning-of-line)
  ;; (outline-next-heading)

  (let ( (y-start (line-number-at-pos)) (y-head (line-number-at-pos)) (x-start -99) (x-head -99) )
    ;; go forward to the nearest heading line
    ;; unless already on a heading line
    ;; in which case keep searching lines forward
    ;; until line gaps exist between the detected heading
    ;; and where the search started
    ;(if (= (- y-start 1) (count-lines (point-min) (point-max))) (setq y-start -99)) ; stops 1st line non-terminating loop
    (while (= y-start y-head)
      (setq y-start (line-number-at-pos))
      (beginning-of-line) (setq x-start (point))
      (re-search-forward (concat "^" wik-outline-regexp) nil t)
      (setq y-head (line-number-at-pos))
       (setq x-head (point)) (beginning-of-line)
      (if (= y-start y-head)
	  (forward-line 1)
	(beginning-of-line)
	)
      (if (= x-start x-head)
	  (progn
	    (setq y-start -99) ; cancels loop when there isn't heading text
	    (goto-char (point-max))
	    )
	)
      ;; (if (= (- y-start 1) (count-lines (point-min) (point-max)))
      ;; 	  (progn
      ;; 	    (goto-char (point-max)) ; put in position to add non-exist. heading
      ;; 	    (setq y-start -99) ; stops last line non-terminating loop
      ;; 	    )
      ;; 	)
      )
    )
  )

(defun wik-previous-heading ()
  (interactive)
  (let ( (y1 -99) (y2 -99) (y-start (line-number-at-pos)) (y-head (line-number-at-pos)) (x-start -99) (x-head -99) )
    ;; go backward to the nearest heading line
    ;; unless already on a heading line
    ;; in which case keep searching heading lines backwards
    ;; until line gaps exist between the detected heading
    ;; and where the search started
    (if (= y-start 1) (setq y-start -99)) ; stops 1st line non-terminating loop
    (while (= y-start y-head)
      (setq y-start (line-number-at-pos))
      (end-of-line) (setq x-start (point))
      (re-search-backward (concat "^" wik-outline-regexp) nil t)
      (setq y-head (line-number-at-pos))
      (setq x-head (point))
      (if (= y-start y-head)
	  (forward-line -1)
	)
      (if (= x-start x-head)
	  (setq y-start -99)) ; cancels loop when there isn't heading text
      )
    ;; walk back 1 line at a time for any additional lines in that heading
    ;; searching forward each iteration to diff y1 and y2
    ;; and stopping once they are no longer 1 line apart
    (setq y2 (line-number-at-pos))
    (setq y1 (- y2 1))
    (while (= y2 (+ y1 1))
      (goto-line y1)    (beginning-of-line)
      (setq y1 (- (line-number-at-pos) 1))
      (re-search-forward (concat "^" wik-outline-regexp) nil t)
      (setq y2 (line-number-at-pos))
      (if (< y2 2) (setq y1 -99))
      )
    (goto-line y2) ; navigate to y2 which is the first line of the heading
    (beginning-of-line)
    (message (concat (number-to-string y1) " " (number-to-string y2)))
    )
  )

(defun wik-outline-entry-toggle ()
  (interactive)
  (let ((x (point)) (test-x -99) (y (line-number-at-pos)) )
    (beginning-of-line)
    (setq test-x (point))
    (re-search-forward wik-outline-regexp nil t)
    (if (not (= test-x (point)))
	(if (= y (line-number-at-pos))
	    (progn
	      (re-search-forward wik-outline-heading-end-regexp nil t)
	      (setq x (point))
	      )
	    )
	)
    (goto-char x)
    (outline-toggle-children)
    )
  )
