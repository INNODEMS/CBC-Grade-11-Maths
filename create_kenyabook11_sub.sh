#!/bin/sh

#php createrepo.php -l course -c "STACK for Linear Algebra" -d "STACK for Linear Algebra"
cd "assets/stack/"
# 20105,121817
# 22474, 121817
cd ~/projects/stack/moodle-qbank_gitsync/cli
php createrepo.php -l course -c "Interns Demonstration" -q=24473 -d "textbook/pretext-repos/CBC-Grade-11-Maths/assets/stack" -k
