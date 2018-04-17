# Specify defaults for testing
PREFIX := $(shell pwd)/prefix
PYTHON = dls-python
MODULEVER=0.0

# Override with any release info
-include Makefile.private

# Clean the module
clean:
	rm -rf docs/html
	find -name '*~' -delete

# Build docs
docs:
	sphinx-build -b html docs docs/html

.PHONY: docs
