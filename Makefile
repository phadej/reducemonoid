all : test

.PHONY : all test benchmark jshint mocha istanbul dist

BINDIR=node_modules/.bin/

MOCHA=$(BINDIR)/_mocha
ISTANBUL=$(BINDIR)/istanbul
JSHINT=$(BINDIR)/jshint
JSCS=$(BINDIR)/jscs
LJS=$(BINDIR)/ljs

SRC=index.js
DEVSRC=bench/performance.js test/test.js

test : jshint jscs mocha istanbul

benchmark :
	node bench/performance.js

jshint :
	$(JSHINT) $(SRC) $(DEVSRC)

jscs :
	$(JSCS) $(SRC) $(DEVSRC)

mocha : 
	$(MOCHA) --reporter=spec test

istanbul :
	$(ISTANBUL) cover $(MOCHA) test
	$(ISTANBUL) check-coverage --statements 100 --branches 100 --functions 100 --lines 100

README.md : $(SRC)
	$(LJS) -c false -o README.md $(SRC)

dist : README.md test
	git clean -fdx -e node_modules
