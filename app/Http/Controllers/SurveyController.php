<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSurveyRequest;
use App\Http\Enums\QuestionTypeEnum;
use App\Http\Requests\UpdateSurveyRequest;
use App\Http\Resources\SurveyResource;
use App\Models\Survey;
use App\Models\SurveyQuestion;
use App\Models\SurveyQuestionAnswer;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;
use Illuminate\Support\Str; 
use Illuminate\Validation\Rules\Enum;
use Illuminate\Support\Arr;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        return SurveyResource::collection(
            Survey::where('user_id', $user->id)->orderBy('created_at', 'desc')->paginate(10)
        );

    }

    public function store(StoreSurveyRequest $request)
    {
        $data = $request->validated();
        
        
        //check if image was given and save to local file system
        if(isset($data['image'])){
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;
        }

        $survey = Survey::create($data);

        foreach($data['questions'] as $question){
            $question['survey_id'] = $survey->id;
            $this->createQuestion($question);
        }

        return new SurveyResource($survey);
    }


    public function show(Survey $survey, Request $request)
    {
        $user = $request->user();
        if($user->id !== $survey->user_id){
            return abort(403, 'Unauthorized action');
        }

        return new SurveyResource($survey);
    }


    public function update(UpdateSurveyRequest $request, Survey $survey)
    {
        $data = $request->validated();

        //check if image exists and save on local file storage
        if(isset($data['image'])){
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;
        }

        //check for old image and delete
        if($survey->image){
            $absolutePath = public_path($survey->image);
            File::delete($absolutePath);
        }

        $survey->update($data);

        $existingIds = $survey->questions->pluck('id')->toArray();   //get ids as plain array of existing questions

        $newIds = Arr::pluck($data['questions'], 'id'); //get ids as plain array of new questions
   
        $toDelete = array_diff($newIds, $existingIds);   //find questions to delete

        $toAdd = array_diff($existingIds, $newIds); //find questions to add

        SurveyQuestion::destroy($toDelete);

        //create new questions
        foreach($data['questions'] as $question){
            if(in_array($question['id'], $toAdd)){
                $question['survey_id'] = $survey->id;
                $this->createQuestion($question);
            }
        }

        $questionMap = collect($data['questions'])->keyBy('id');

        foreach($survey->questions as $questions){
            if(isset($questionMap[$question->id])){
                $this->updateQuestion($question, $questionMap[$question->id]);
            }
        }
        return new SurveyResource($survey);
    }

    public function destroy(Survey $survey, Request $request)
    {
        $user  = $request->user();

        if($user->id !== $survey->user_id){
            return abort(403, 'Unauthorized action');
        }

        $survey->delete();

        if($survey->image){
            $absolutePath = public_path($survey->image);
            File::delete($absolutePath);
        }

        return response('', 204);
    }

    private function saveImage($image)
    {
        //check if image is valid base 64 string
        if(preg_match('/^data:image\/(\w+);base64,/', $image, $type)){
            $image = substr($image, strpos($image, ',') + 1); //take out base 64 encoded without the meme type
            $type = strtolower($type[1]); //jpg, png, gif

            if(!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])){
                throw new \Exception('invalid image type');
            }
            $image = str_replace(' ', '+', $image);
            $image = base64_decode($image);

            if($image === false){
                throw new \Exception('base64_decode failed');
            }
        }else{
            throw new \Exception('Did not match data URI with image data');
        }

        $dir = 'images/';
        $file = Str::random() . '.' .$type;
        $absolutePath = public_path($dir);
        if(!File::exists($absolutePath)){
            File::makeDirectory($absolutePath, 0755, true);
        }
        file_put_contents($relativePath, $image);

        return $relativePath;
    }

    private function createQuestion($data)
    {
        if(is_array($data['data'])){
            $data['data'] = json_encode($data['data']);
        }

        $validator = Validator::make($data, [
            'question' => 'required|string',
            'type' => ['required', new Enum(QuestionTypeEnum::class)],
            'description' => 'nullable|string',
            'data' => 'present',
            'survey_id' => 'exists:App\Models\Survey,id'
        ]);

        return SurveyQuestion::create($validator->validated());
    }

    private function updateQuestion(SurveyQuestion $question, $data)
    {
        if(is_array($data['data'])){
            $data['data'] = json_encode($data['data']);
        }

        $validator = Validator::make($data, [
            'id' => 'exists:App\Models\SurveyQuestion,id',
            'question' => 'required|string',
            'type' => ['required', new Enum(QuestionTypeEnum::class)],
            'description' => 'nullable|string',
            'data' => 'present'
        ]);

        return $question->update($validator->validated());
    }
}