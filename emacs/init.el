(set-face-attribute 'region nil :background "#fdfd96") ; pastel yellow mark

;; (defun wik-hook-collapse-all ()
;;   ;;(outline-hide-sublevels 1)
;;   (outline-cycle-buffer)
;;   )
;; (add-hook 'wik-mode-hook #'wik-hook-collapse-all)
;; ;; example overrides:
;; ;    (setq wik-kbd-wik-move-to-file "C-S-<left>")


;; START IN THE SCRATCH BUFFER
;; WITH WIK MODE ENABLED
;;     M-S-f to open any file in wik mode
;;     tab key press will insert 4 spaces
;;     enter key press will add a newline without any indentation
;;     M-S-o to collapse/expand uppercase lines
;;         (sometimes also works with comments in programming language files)
;;     M-S-<down> with cursor over a path to open in other window
(load-file "/k/emacs/wik-mode/wik-mode.el")
(setq initial-scratch-message "")
(setq inhibit-startup-screen t)
(switch-to-buffer "*scratch*")
(wik-mode)
(set-fill-column 79)

(fset 'wikhead
   (kmacro-lambda-form [?\C-a ?\C-  ?\C-e ?\M-x ?u ?p ?c ?a ?s ?e ?- ?r ?e ?g tab return ? ] 0 "%d"))

(fset 'unwikhead
   (kmacro-lambda-form [?\C-a ?\C-  ?\C-e ?\M-x ?d ?o ?w ?n ?c ?a ?s ?e ?- ?r ?e ?g ?i ?o ?n return ? ] 0 "%d"))

(fset 'unwiktitle
   (kmacro-lambda-form [?\C-a ?\C-  ?\C-e ?\M-x ?u ?n ?w ?i tab return ?\C-a ?\C-  ?\C-e ?\M-x ?c ?a ?p ?i ?t ?a ?l ?i ?z ?e ?- ?r ?e ?g ?i ?o ?n return] 0 "%d"))


(load-file "/k/emacs/speed-type.el")

(load-file "/k/repos/koreyhinton.com/apps/hashscript/author/author.el")

(setq visible-bell t)
(setq ring-bell-function 'ignore)
