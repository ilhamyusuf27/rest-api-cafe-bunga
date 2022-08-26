CREATE TABLE IF NOT EXISTS public.users
(
    user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'::regclass),
    name character varying(150) COLLATE pg_catalog."default" NOT NULL,
    phone_number character varying(150) COLLATE pg_catalog."default" NOT NULL,
    email character varying(150) COLLATE pg_catalog."default" NOT NULL,
    password character varying(150) COLLATE pg_catalog."default" NOT NULL,
    photo_profil character varying(150) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    CONSTRAINT users_pkey PRIMARY KEY (user_id)
)

CREATE TABLE IF NOT EXISTS public.recipe
(
    recipe_id integer NOT NULL DEFAULT nextval('recipe_recipe_id_seq'::regclass),
    user_id integer,
    title character varying(150) COLLATE pg_catalog."default" NOT NULL,
    ingredients character varying(300) COLLATE pg_catalog."default" NOT NULL,
    recipe_images character varying(150) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    video_link character varying[] COLLATE pg_catalog."default",
    save character varying[] COLLATE pg_catalog."default",
    likes character varying[] COLLATE pg_catalog."default" DEFAULT '{}'::character varying[],
    CONSTRAINT recipe_pkey PRIMARY KEY (recipe_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS public.comments
(
    comment_id integer NOT NULL DEFAULT nextval('comments_comment_id_seq'::regclass),
    recipe_id integer,
    user_id integer,
    comment character varying(500) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT comments_pkey PRIMARY KEY (comment_id),
    CONSTRAINT fk_recipe FOREIGN KEY (recipe_id)
        REFERENCES public.recipe (recipe_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS public.users_likes
(
    likes_id integer NOT NULL DEFAULT nextval('users_likes_likes_id_seq'::regclass),
    recipe_id integer,
    user_id integer,
    CONSTRAINT users_likes_pkey PRIMARY KEY (likes_id),
    CONSTRAINT fk_users FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS public.users_saves
(
    saves_id integer NOT NULL DEFAULT nextval('users_saves_saves_id_seq'::regclass),
    recipe_id integer,
    user_id integer,
    CONSTRAINT users_saves_pkey PRIMARY KEY (saves_id),
    CONSTRAINT fk_users FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)