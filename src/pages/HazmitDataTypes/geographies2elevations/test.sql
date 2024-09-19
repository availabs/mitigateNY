CREATE OR REPLACE FUNCTION public.point_to_mercator(point GEOMETRY(POINT, 4326), zoom INTEGER) RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE STRICT
AS $$
  DECLARE
    pi DOUBLE PRECISION := PI();
    diamter DOUBLE PRECISION := pi * 2;
    z2 INTEGER := POW(2, zoom);
    to_rads DOUBLE PRECISION := 180 / pi;

    longitude DOUBLE PRECISION := ST_X(point);
    latitude DOUBLE PRECISION := ST_Y(point);

    x1 DOUBLE PRECISION := longitude * to_rads;
    y1 DOUBLE PRECISION := latitude * to_rads;

    x2 DOUBLE PRECISION := x1;
    y2 DOUBLE PRECISION := log(tan(0.25 * pi + 0.5 * y1));

    x3 DOUBLE PRECISION := z2 * (x2 + pi) / diameter;
    y3 DOUBLE PRECISION := z2 * (pi - y2) / diameter;
  BEGIN
    RETURN zoom::TEXT || '-' || FLOOR(x3)::TEXT || '-' || FLOOR(y3)::TEXT;
  END
$$;
