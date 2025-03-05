
# Conda Environment Setup for Employee Manager Backend

This guide helps you set up a Conda environment for the Employee Manager backend.

## Setting Up the Environment

1. Make sure you have Conda installed (Miniconda or Anaconda)

2. Create the environment from the environment.yml file:
   ```
   conda env create -f environment.yml
   ```

   Or create it manually:
   ```
   conda create -n employee-manager-env python=3.12
   conda activate employee-manager-env
   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
   ```

3. Activate the environment:
   ```
   conda activate employee-manager-env
   ```

4. Verify the installation:
   ```
   python -c "import django; print(django.__version__)"
   ```

5. Run the Django server:
   ```
   python manage.py runserver
   ```

## Updating the Environment

If dependencies change, update your environment:

```
conda env update -f environment.yml --prune
```

## Exporting Environment

If you've added packages and want to share the updated environment:

```
conda env export > environment.yml
```
