BEGIN TRANSACTION;
CREATE TABLE "Account" (
	id INTEGER NOT NULL, 
	"Name" VARCHAR(255), 
	"Phone" VARCHAR(255), 
	"NumberOfEmployees" VARCHAR(255), 
	"Description" VARCHAR(255), 
	"Website" VARCHAR(255), 
	PRIMARY KEY (id)
);
INSERT INTO "Account" VALUES(1,'Harmony','111-222-3333','10','This is Harmony','www.harmony.com');
INSERT INTO "Account" VALUES(2,'Love','222-333-4444','4','This is Love','www.love.com');
INSERT INTO "Account" VALUES(3,'Peace','333-444-5555','600','This is Peace','www.peace.com');
INSERT INTO "Account" VALUES(4,'Zen','555-666-7777','1','This is Zen','www.zen.com');
COMMIT;
