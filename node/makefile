SUBDIRS := $(wildcard */)

all:
	@for dir in $(SUBDIRS); do \
		cd $$dir && \
		make all; \
	done