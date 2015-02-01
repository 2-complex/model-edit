/**
 * Adapted from o3d's math.js file.  This file uses flat arrays for 4x4 matrices
 * but has only some of the functionality.
 */


/**
 * Computes the dot product of two vectors; assumes that a and b have
 * the same dimension.
 */
dot = function(a, b) {
  var r = 0.0;
  var dimension = a.length;
  for (var i = 0; i < dimension; ++i)
    r += a[i] * b[i];
  return r;
};

/**
 * Adds two vectors; assumes a and b have the same dimension.
 */
addVector = function(a, b) {
  var r = [];
  var dimension = a.length;
  for (var i = 0; i < dimension; ++i)
    r[i] = a[i] + b[i];
  return r;
};

/**
 * Subtracts two vectors.
 */
subVector = function(a, b) {
  var r = [];
  var dimension = a.length;
  for (var i = 0; i < dimension; ++i)
    r[i] = a[i] - b[i];
  return r;
};

/**
 * Computes the cross product of two vectors; assumes both vectors have
 * three entries.
 */
cross = function(a, b) {
  return [a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0]];
};

/**
 * Computes the Euclidean length of a vector, i.e. the square root of the
 * sum of the squares of the entries.
 */
length = function(a) {
  var r = 0.0;
  var dimension = a.length;
  for (var i = 0; i < dimension; ++i)
    r += a[i] * a[i];
  return Math.sqrt(r);
};

/**
 * Divides a vector by its Euclidean length and returns the quotient.
 */
normalize = function(a) {
  var r = [];
  var n = 0.0;
  var dimension = a.length;
  for (var i = 0; i < dimension; ++i)
    n += a[i] * a[i];
  n = Math.sqrt(n);
  for (var i = 0; i < dimension; ++i)
    r[i] = a[i] / n;
  return r;
};


/**
 * Computes the inverse of a 4-by-4 matrix.
 */
inverse = function(m) {
  var tmp_0 = m[10] * m[15];
  var tmp_1 = m[14] * m[11];
  var tmp_2 = m[6] * m[15];
  var tmp_3 = m[14] * m[7];
  var tmp_4 = m[6] * m[11];
  var tmp_5 = m[10] * m[7];
  var tmp_6 = m[2] * m[15];
  var tmp_7 = m[14] * m[3];
  var tmp_8 = m[2] * m[11];
  var tmp_9 = m[10] * m[3];
  var tmp_10 = m[2] * m[7];
  var tmp_11 = m[6] * m[3];
  var tmp_12 = m[8] * m[13];
  var tmp_13 = m[12] * m[9];
  var tmp_14 = m[4] * m[13];
  var tmp_15 = m[12] * m[5];
  var tmp_16 = m[4] * m[9];
  var tmp_17 = m[8] * m[5];
  var tmp_18 = m[0] * m[13];
  var tmp_19 = m[12] * m[1];
  var tmp_20 = m[0] * m[9];
  var tmp_21 = m[8] * m[1];
  var tmp_22 = m[0] * m[5];
  var tmp_23 = m[4] * m[1];

  var t0 = (tmp_0 * m[5] + tmp_3 * m[9] + tmp_4 * m[13]) -
      (tmp_1 * m[5] + tmp_2 * m[9] + tmp_5 * m[13]);
  var t1 = (tmp_1 * m[1] + tmp_6 * m[9] + tmp_9 * m[13]) -
      (tmp_0 * m[1] + tmp_7 * m[9] + tmp_8 * m[13]);
  var t2 = (tmp_2 * m[1] + tmp_7 * m[5] + tmp_10 * m[13]) -
      (tmp_3 * m[1] + tmp_6 * m[5] + tmp_11 * m[13]);
  var t3 = (tmp_5 * m[1] + tmp_8 * m[5] + tmp_11 * m[9]) -
      (tmp_4 * m[1] + tmp_9 * m[5] + tmp_10 * m[9]);

  var d = 1.0 / (m[0] * t0 + m[4] * t1 + m[8] * t2 + m[12] * t3);

  return [d * t0, d * t1, d * t2, d * t3,
	   d * ((tmp_1 * m[4] + tmp_2 * m[8] + tmp_5 * m[12]) -
          (tmp_0 * m[4] + tmp_3 * m[8] + tmp_4 * m[12])),
       d * ((tmp_0 * m[0] + tmp_7 * m[8] + tmp_8 * m[12]) -
          (tmp_1 * m[0] + tmp_6 * m[8] + tmp_9 * m[12])),
       d * ((tmp_3 * m[0] + tmp_6 * m[4] + tmp_11 * m[12]) -
          (tmp_2 * m[0] + tmp_7 * m[4] + tmp_10 * m[12])),
       d * ((tmp_4 * m[0] + tmp_9 * m[4] + tmp_10 * m[8]) -
          (tmp_5 * m[0] + tmp_8 * m[4] + tmp_11 * m[8])),
       d * ((tmp_12 * m[7] + tmp_15 * m[11] + tmp_16 * m[15]) -
          (tmp_13 * m[7] + tmp_14 * m[11] + tmp_17 * m[15])),
       d * ((tmp_13 * m[3] + tmp_18 * m[11] + tmp_21 * m[15]) -
          (tmp_12 * m[3] + tmp_19 * m[11] + tmp_20 * m[15])),
       d * ((tmp_14 * m[3] + tmp_19 * m[7] + tmp_22 * m[15]) -
          (tmp_15 * m[3] + tmp_18 * m[7] + tmp_23 * m[15])),
       d * ((tmp_17 * m[3] + tmp_20 * m[7] + tmp_23 * m[11]) -
          (tmp_16 * m[3] + tmp_21 * m[7] + tmp_22 * m[11])),
       d * ((tmp_14 * m[10] + tmp_17 * m[14] + tmp_13 * m[6]) -
          (tmp_16 * m[14] + tmp_12 * m[6] + tmp_15 * m[10])),
       d * ((tmp_20 * m[14] + tmp_12 * m[2] + tmp_19 * m[10]) -
          (tmp_18 * m[10] + tmp_21 * m[14] + tmp_13 * m[2])),
       d * ((tmp_18 * m[6] + tmp_23 * m[14] + tmp_15 * m[2]) -
          (tmp_22 * m[14] + tmp_14 * m[2] + tmp_19 * m[6])),
       d * ((tmp_22 * m[10] + tmp_16 * m[2] + tmp_21 * m[6]) -
          (tmp_20 * m[6] + tmp_23 * m[10] + tmp_17 * m[2]))];
};


/**
 * Creates a 4-by-4 identity matrix.
 */
identity = function() {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
};

/**
 * Computes a 4-by-4 perspective transformation matrix given the angular height
 * of the frustum, the aspect ratio, and the near and far clipping planes.  The
 * arguments define a frustum extending in the negative z direction.  The given
 * angle is the vertical angle of the frustum, and the horizontal angle is
 * determined to produce the given aspect ratio.  The arguments near and far are
 * the distances to the near and far clipping planes.  Note that near and far
 * are not z coordinates, but rather they are distances along the negative
 * z-axis.  The matrix generated sends the viewing frustum to the unit box.
 * We assume a unit box extending from -1 to 1 in the x and y dimensions and
 * from 0 to 1 in the z dimension.
 */
perspective = function(angle, aspect, near, far) {
  var f = Math.tan(0.5 * (Math.PI - angle));
  var range = near - far;

  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, far / range, -1,
    0, 0, near * far / range, 0
  ];
};

/**
 * Computes a 4-by-4 look-at transformation.  The transformation generated is
 * an orthogonal rotation matrix with translation component.  The translation
 * component sends the eye to the origin.  The rotation component sends the
 * vector pointing from the eye to the target to a vector pointing in the
 * negative z direction, and also sends the up vector into the upper half of
 * the yz plane.
 */
lookAt = function(eye, target, up) {
  var vz = normalize(subVector(eye, target).slice(0, 3)).concat(0);
  var vx = normalize(
      cross(up, vz)).concat(0);
  var vy = cross(vz, vx).concat(0);
  
  return inverse(vx.concat(vy).concat(vz).concat(eye).concat(1));
};

/**
 * Creates a 4-by-4 matrix which translates by the given vector v.
 */
translation = function(v) {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    v[0], v[1], v[2], 1
  ];
};

/**
 * Creates a 4-by-4 matrix which scales in each dimension by an amount given by
 * the corresponding entry in the given vector; assumes the vector has three
 * entries.
 */
scaling = function(v) {
  return [
    v[0], 0, 0, 0,
    0, v[1], 0, 0,
    0, 0, v[2], 0,
    0, 0, 0, 1
  ];
};

/**
 * Creates a 4-by-4 matrix which rotates around the x-axis by the given angle.
 */
rotationX = function(angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  return [
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1
  ];
};


/**
 * Creates a 4-by-4 matrix which rotates around the y-axis by the given angle.
 */
rotationY = function(angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  return [
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
  ];
};

/**
 * Creates a 4-by-4 matrix which rotates around the z-axis by the given angle.
 */
rotationZ = function(angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  return [
    c, s, 0, 0,
    -s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
};

/**
 * Creates a 4-by-4 matrix which rotates around the given axis by the given
 * angle.
 */
axisRotation = function(axis, angle) {
  var x = axis[0];
  var y = axis[1];
  var z = axis[2];
  var n = Math.sqrt(x * x + y * y + z * z);
  x /= n;
  y /= n;
  z /= n;
  var xx = x * x;
  var yy = y * y;
  var zz = z * z;
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var oneMinusCosine = 1 - c;

  return [
    xx + (1 - xx) * c,
    x * y * oneMinusCosine + z * s,
    x * z * oneMinusCosine - y * s,
    0,
    x * y * oneMinusCosine - z * s,
    yy + (1 - yy) * c,
    y * z * oneMinusCosine + x * s,
    0,
    x * z * oneMinusCosine + y * s,
    y * z * oneMinusCosine - x * s,
    zz + (1 - zz) * c,
    0,
    0, 0, 0, 1
  ];
};



