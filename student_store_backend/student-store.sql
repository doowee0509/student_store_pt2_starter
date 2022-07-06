\echo 'Delete and recreate student_store db?'
\prompt 'Return for yes or control-C to cancel > ' answer

DROP DATABASE student_store;
CREATE DATABASE student_store;
\connect student_store

\i student-store-schema.sql
\i student-store-seed.sql

-- \echo 'Delete and recreate auth_starter_test db?'
-- \prompt 'Return for yes or control-C to cancel > ' answer

-- DROP DATABASE auth_starter_test;
-- CREATE DATABASE auth_starter_test;
-- \connect auth_starter_test

-- \i auth-starter-schema.sql
